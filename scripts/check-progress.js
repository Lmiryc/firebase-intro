const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const reportOnly = process.argv.includes('--report-only');
const root = path.resolve(__dirname, '..');

function parseFile(relativePath) {
  const filename = path.join(root, relativePath);
  const source = fs.readFileSync(filename, 'utf8');
  return {
    source,
    ast: parser.parse(source, {
      sourceType: 'module',
      plugins: ['jsx'],
    }),
  };
}

function callName(node) {
  if (!node || node.type !== 'CallExpression') return '';
  if (node.callee.type === 'Identifier') return node.callee.name;
  if (node.callee.type === 'MemberExpression' && !node.callee.computed) {
    return node.callee.property.name || '';
  }
  return '';
}

function callsIn(ast, expectedName) {
  let found = false;
  traverse(ast, {
    CallExpression(pathRef) {
      if (callName(pathRef.node) === expectedName) found = true;
    },
  });
  return found;
}

function hasIdentifier(ast, expectedName) {
  let found = false;
  traverse(ast, {
    Identifier(pathRef) {
      if (pathRef.node.name === expectedName) found = true;
    },
  });
  return found;
}

function hasMember(ast, objectName, propertyName) {
  let found = false;
  traverse(ast, {
    MemberExpression(pathRef) {
      const { object, property } = pathRef.node;
      if (object.type === 'Identifier' && object.name === objectName && property.name === propertyName) {
        found = true;
      }
    },
  });
  return found;
}

function hasCallWithStringArgs(ast, name, expectedArgs) {
  let found = false;
  traverse(ast, {
    CallExpression(pathRef) {
      if (callName(pathRef.node) !== name) return;
      const matches = expectedArgs.every((expected, index) => {
        const argument = pathRef.node.arguments[index];
        if (expected.type === 'identifier') return argument && argument.type === 'Identifier' && argument.name === expected.value;
        return argument && (argument.value === expected.value || argument.extra?.rawValue === expected.value);
      });
      if (matches) found = true;
    },
  });
  return found;
}

function hasCallContainingObjectProperties(ast, name, properties) {
  let found = false;
  traverse(ast, {
    CallExpression(pathRef) {
      if (callName(pathRef.node) !== name) return;
      const visit = node => {
        if (!node || typeof node !== 'object') return false;
        if (node.type === 'ObjectProperty') {
          const key = node.key.name || node.key.value;
          if (properties.includes(key)) return true;
        }
        return Object.keys(node).some(key => {
          if (['loc', 'start', 'end', 'comments'].includes(key)) return false;
          const value = node[key];
          return Array.isArray(value) ? value.some(visit) : visit(value);
        });
      };
      if (visit(pathRef.node)) found = true;
    },
  });
  return found;
}

function hasEffectCleanupFor(ast, subscriptionFunction) {
  let found = false;
  traverse(ast, {
    CallExpression(pathRef) {
      if (callName(pathRef.node) !== 'useEffect') return;
      const effect = pathRef.node.arguments[0];
      if (!effect || !['ArrowFunctionExpression', 'FunctionExpression'].includes(effect.type)) return;
      const declarations = new Set();
      const returned = new Set();
      const inspect = node => {
        if (!node || typeof node !== 'object') return;
        if (node !== effect && ['ArrowFunctionExpression', 'FunctionExpression'].includes(node.type)) return;
        if (node.type === 'VariableDeclarator' && node.init?.type === 'CallExpression' && callName(node.init) === subscriptionFunction && node.id.type === 'Identifier') {
          declarations.add(node.id.name);
        }
        if (node.type === 'ReturnStatement' && node.argument?.type === 'Identifier') returned.add(node.argument.name);
        Object.keys(node).forEach(key => {
          if (['loc', 'start', 'end', 'comments'].includes(key)) return;
          const value = node[key];
          if (Array.isArray(value)) value.forEach(inspect);
          else inspect(value);
        });
      };
      inspect(effect.body);
      if ([...declarations].some(name => returned.has(name))) found = true;
    },
  });
  return found;
}

function functionReturnsCall(ast, functionName, call) {
  let found = false;
  traverse(ast, {
    FunctionDeclaration(pathRef) {
      if (pathRef.node.id?.name !== functionName) return;
      pathRef.traverse({
        ReturnStatement(returnPath) {
          if (callName(returnPath.node.argument) === call) found = true;
        },
      });
    },
  });
  return found;
}

function hasSnapshotMapping(ast) {
  let mapsDocuments = false;
  let preservesId = false;
  let spreadsData = false;
  traverse(ast, {
    CallExpression(pathRef) {
      if (callName(pathRef.node) === 'map' && pathRef.node.callee.type === 'MemberExpression') {
        const object = pathRef.node.callee.object;
        if (object.type === 'MemberExpression' && object.property.name === 'docs') mapsDocuments = true;
      }
    },
    MemberExpression(pathRef) {
      const node = pathRef.node;
      if (node.object.type === 'Identifier' && node.object.name === 'documentSnapshot' && node.property.name === 'id') preservesId = true;
      if (node.object.type === 'Identifier' && node.object.name === 'documentSnapshot' && node.property.name === 'data') spreadsData = true;
    },
  });
  return mapsDocuments && preservesId && spreadsData;
}

function callbackContainsErrorHandling(ast, functionName, consumerAst) {
  let forwardedErrorParameter = '';
  traverse(ast, {
    FunctionDeclaration(pathRef) {
      if (pathRef.node.id?.name !== functionName) return;
      pathRef.traverse({
        CallExpression(callPath) {
          if (callName(callPath.node) !== 'onSnapshot') return;
          const errorCallback = callPath.node.arguments[2];
          if (errorCallback && ['ArrowFunctionExpression', 'FunctionExpression'].includes(errorCallback.type)) {
            if (errorCallback.params.length > 0) forwardedErrorParameter = errorCallback.params[0].name;
          } else if (errorCallback?.type === 'Identifier' && pathRef.node.params.some(param => param.name === errorCallback.name)) {
            forwardedErrorParameter = errorCallback.name;
          }
        },
      });
    },
  });
  if (!forwardedErrorParameter) return false;

  let consumerHandlesError = false;
  traverse(consumerAst, {
    CallExpression(pathRef) {
      if (callName(pathRef.node) !== 'subscribeToMessages') return;
      const callback = pathRef.node.arguments[1];
      if (!callback || !['ArrowFunctionExpression', 'FunctionExpression'].includes(callback.type)) return;
      const errorParameter = callback.params[0]?.name;
      if (!errorParameter) return;
      let readsErrorMessage = false;
      let updatesVisibleError = false;
      const inspect = node => {
        if (!node || typeof node !== 'object') return;
        if (node.type === 'MemberExpression' && node.object.type === 'Identifier'
          && node.object.name === errorParameter && node.property.name === 'message') readsErrorMessage = true;
        if (node.type === 'CallExpression' && callName(node) === 'setMessageError') updatesVisibleError = true;
        Object.keys(node).forEach(key => {
          if (['loc', 'start', 'end', 'comments'].includes(key)) return;
          const value = node[key];
          if (Array.isArray(value)) value.forEach(inspect);
          else inspect(value);
        });
      };
      inspect(callback.body);
      if (readsErrorMessage && updatesVisibleError) consumerHandlesError = true;
    },
  });
  return consumerHandlesError;
}

function hasCallbackStateUpdate(ast, subscriptionCall, stateSetter) {
  let found = false;
  traverse(ast, {
    CallExpression(pathRef) {
      if (callName(pathRef.node) !== subscriptionCall) return;
      const callback = pathRef.node.arguments[0];
      if (!callback || !['ArrowFunctionExpression', 'FunctionExpression'].includes(callback.type)) return;
      traverse(callback, {
        CallExpression(callbackPath) {
          if (callName(callbackPath.node) === stateSetter) found = true;
        },
      }, pathRef.scope, pathRef.state, pathRef);
    },
  });
  return found;
}

function hasOrderByCreatedAtDescending(ast) {
  let found = false;
  traverse(ast, {
    CallExpression(pathRef) {
      const args = pathRef.node.arguments;
      if (callName(pathRef.node) === 'orderBy' && args[0]?.value === 'createdAt' && args[1]?.value === 'desc') found = true;
    },
  });
  return found;
}

function hasEnvironmentReferences(ast) {
  const required = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
  ];
  const found = new Set();
  traverse(ast, {
    MemberExpression(pathRef) {
      const node = pathRef.node;
      if (node.object.type === 'MemberExpression' && node.object.object.name === 'process' && node.object.property.name === 'env') {
        found.add(node.property.name);
      }
    },
  });
  return required.every(key => found.has(key));
}

function hasAuthStateAndCleanup(authAst, appAst) {
  return callsIn(authAst, 'onAuthStateChanged')
    && callsIn(appAst, 'observeAuthState')
    && hasCallbackStateUpdate(appAst, 'observeAuthState', 'setUser')
    && hasIdentifier(appAst, 'setAuthReady')
    && hasEffectCleanupFor(appAst, 'observeAuthState');
}

function inspectProgress() {
  const config = parseFile('firebase/config.js');
  const auth = parseFile('firebase/authService.js');
  const messages = parseFile('firebase/messageService.js');
  const app = parseFile('App.js');
  const rules = fs.readFileSync(path.join(root, 'firestore.rules'), 'utf8');
  const createMessageCall = hasCallWithStringArgs(messages.ast, 'collection', [
    { type: 'identifier', value: 'db' },
    { type: 'string', value: 'messages' },
  ]);
  const checks = [
    {
      title: 'PART 1: Firebase initialized from environment configuration',
      complete: callsIn(config.ast, 'initializeApp') && callsIn(config.ast, 'getApps') && callsIn(config.ast, 'getApp')
        && callsIn(config.ast, 'getAuth') && callsIn(config.ast, 'getFirestore') && hasEnvironmentReferences(config.ast),
      guidance: 'In firebase/config.js, initialize the Firebase app once, create Auth and Firestore clients, and reference each EXPO_PUBLIC_FIREBASE_* setting.',
    },
    {
      title: 'PART 2: Authentication state observer installed',
      complete: hasAuthStateAndCleanup(auth.ast, app.ast),
      guidance: 'In firebase/authService.js and App.js, observe Firebase auth state, update user/readiness state, and return the observer unsubscribe from the effect.',
    },
    {
      title: 'PART 3: Sign up, sign in, and sign out implemented',
      complete: callsIn(auth.ast, 'createUserWithEmailAndPassword') && callsIn(auth.ast, 'signInWithEmailAndPassword') && callsIn(auth.ast, 'signOut'),
      guidance: 'Add the three email/password Authentication operations in firebase/authService.js and connect them to the signed-out/signed-in UI.',
    },
    {
      title: 'PART 4: Authenticated messages can be created',
      complete: callsIn(messages.ast, 'addDoc') && createMessageCall
        && hasIdentifier(messages.ast, 'authorId') && hasIdentifier(messages.ast, 'authorEmail')
        && callsIn(messages.ast, 'serverTimestamp') && hasIdentifier(messages.ast, 'trim'),
      guidance: 'In createMessage(), reject blank text and write trimmed text, the current user ID/email, and serverTimestamp() to messages.',
    },
    {
      title: 'PART 5: One-time Firestore read demonstrated',
      complete: callsIn(messages.ast, 'getDocs') && callsIn(messages.ast, 'query')
        && hasOrderByCreatedAtDescending(messages.ast) && hasSnapshotMapping(messages.ast),
      guidance: 'Keep a clearly named loadMessagesOnce() demonstration using getDocs(), descending createdAt order, and ID-preserving document mapping.',
    },
    {
      title: 'PART 6: Realtime message subscription implemented',
      complete: callsIn(messages.ast, 'onSnapshot') && hasSnapshotMapping(messages.ast)
        && callsIn(app.ast, 'subscribeToMessages') && hasIdentifier(app.ast, 'setMessages')
        && callbackContainsErrorHandling(messages.ast, 'subscribeToMessages', app.ast),
      guidance: 'Subscribe with onSnapshot(), map each document including its ID, update message state, and handle listener errors.',
    },
    {
      title: 'PART 7: Firestore listener is cleaned up',
      complete: functionReturnsCall(messages.ast, 'subscribeToMessages', 'onSnapshot')
        && hasEffectCleanupFor(app.ast, 'subscribeToMessages'),
      guidance: 'Return the unsubscribe provided by onSnapshot() from subscribeToMessages(), then return that same subscription cleanup from the messages effect.',
    },
    {
      title: 'PART 8: Firestore Security Rules included',
      complete: /rules_version\s*=\s*'2'/.test(rules)
        && /allow read:\s*if request\.auth != null/.test(rules)
        && /allow create:[\s\S]*request\.resource\.data\.authorId == request\.auth\.uid/.test(rules),
      guidance: 'Complete firestore.rules so signed-in users can read and only create messages attributed to their own uid.',
    },
  ];

  return checks;
}

try {
  const checks = inspectProgress();
  const completeCount = checks.filter(check => check.complete).length;
  console.log('Firebase Tour Progress\n');
  checks.forEach(check => {
    console.log(`${check.complete ? '✓' : '✗'} ${check.title}`);
    if (!check.complete) console.log(`  Next: ${check.guidance}`);
  });
  console.log(`\n${completeCount} of ${checks.length} parts complete`);
  if (reportOnly && completeCount !== checks.length) console.log('Report-only mode: incomplete lesson steps do not fail this command.');
  else if (completeCount !== checks.length) process.exitCode = 1;
} catch (error) {
  console.error('Progress checker crashed while parsing or inspecting project files.');
  console.error(error.stack || error.message);
  process.exitCode = 2;
}
