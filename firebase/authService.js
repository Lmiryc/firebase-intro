// ======================================================
// PART 3 — AUTHENTICATION ACTIONS
//
// WHY: Authentication gives each participant a stable identity.
// PRODUCT QUESTION: Should anyone be able to post without an account?
// DO: Implement these functions with Firebase email/password Authentication.
// CODE TO COMPLETE:
// ```js
// export function signUp(email, password) { /* TODO: create account */ }
// export function signIn(email, password) { /* TODO: sign in */ }
// export function signOutCurrentUser() { /* TODO: sign out */ }
// ```
// VERIFY: Create an account, sign out, sign in again, then try a wrong password.
// NEXT: Search for "PART 4 — CREATE A MESSAGE" in firebase/messageService.js.
// Never print or save the password outside Firebase Authentication.
// ======================================================

// PART 2 observer is called by the screen after Firebase has been initialized.
export function observeAuthState(callback) {
  // TODO PART 2: connect the callback to Firebase's auth-state observer.
  throw new Error('PART 2 is not complete: observe authentication state.');
}

export function signUp(email, password) {
  // TODO PART 3: call the Firebase account-creation operation.
  throw new Error('PART 3 is not complete: create an account.');
}

export function signIn(email, password) {
  // TODO PART 3: call the Firebase email/password sign-in operation.
  throw new Error('PART 3 is not complete: sign in.');
}

export function signOutCurrentUser() {
  // TODO PART 3: ask Firebase Authentication to sign out.
  throw new Error('PART 3 is not complete: sign out.');
}
