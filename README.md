# Firebase Tour: a realtime message board

A small Expo + React Native application for learning the Firebase ideas that matter when collaborating on prototypes: Authentication, Firestore documents, and realtime updates. The app has one screen and uses React state and effects—no Redux, navigation framework, backend proxy, or production architecture detour.

## Instructor guide

### Branches

- `main` is the student starter. It has a static screen, numbered searchable exercises, TODO service functions, the tests, and a progress checker. `npm run check-progress` reports incomplete parts with a nonzero exit; `npm run check-progress:report` prints the same lesson report and exits successfully for starter-branch automation. The complete feature tests are intentionally red until students implement the tour.
- `complete` is the reference implementation. It passes `npm run verify` and includes the working app, full tests, and all eight parts of the tour.

Switch between them with `git switch main` and `git switch complete`. To check the reference branch from a fresh checkout, run `npm ci` followed by `npm run verify`.

GitHub Actions does not require Firebase secrets. On `main`, it reports lesson progress and runs infrastructure-only tests; on `complete`, it runs the progress checker and full mocked test suite. Other branches run full verification so student work can receive red-to-green feedback. To make a class fork require full verification directly on its default starter branch, change the `main` workflow conditions in `.github/workflows/test.yml` to run `npm run verify`.

Automated tests do not connect to Firebase, need no live Firebase project, and never write to the class project. Optional future emulator tests can add rules-focused integration coverage without changing the fast unit-test workflow.

## Student setup

```sh
git clone <repository-url>
cd firebase-tour
npm install
cp .env.example .env
npm start
```

In Firebase Console, create or select a project, enable **Authentication → Sign-in method → Email/Password**, and create a **Cloud Firestore** database. In the project settings, register a Web app and copy its web configuration values into `.env`. Start with `firestore.rules` and publish the rules to the project before trying authenticated reads and writes.

Copy `.env.example` to `.env` and paste their Firebase **web** configuration into `.env`. Expo substitutes `EXPO_PUBLIC_*` values into the client application. The local `.env` workflow helps avoid accidental repository commits; it does **not** make these client configuration values secret. The security boundary is Firebase Authentication together with Firebase Security Rules. Never put Admin SDK credentials, service-account JSON, or private keys in these variables. This course does not use a backend configuration proxy.

## The tour

Complete **Parts 1–8 in order**. Search the repository for `PART 1`, `PART 2`, and so on; each heading includes why the code matters, a task, a verification, and the next destination. At the end of each part, run:

```sh
npm run check-progress
npm test
```

The progress checker parses active JavaScript with Babel rather than counting lesson comments. Its `--report-only` mode is for the starter branch's CI report. The normal checker exits nonzero when a lesson is incomplete and prints a concrete next step.

1. Configure and initialize Firebase from environment values.
2. Observe the asynchronous Authentication state and show the right screen.
3. Sign up, sign in, and sign out with email and password.
4. Create a Firestore message associated with the current user's UID and email.
5. Demonstrate a one-time read and preserve each document's Firestore ID.
6. Replace the app's startup read with a realtime subscription.
7. Clean up both Auth and Firestore subscriptions when effects end.
8. Read the minimal Firestore Security Rules and discuss what the UI can—and cannot—protect.

The message document is intentionally flat: `text`, `authorId`, `authorEmail`, and `createdAt`. Firestore's document ID is included as `id` when data is mapped to the UI, and the query orders by newest first.

### Security conversation

Hiding a button in React Native is a user-interface choice, not authorization. A client can be changed or call Firebase directly; Firebase evaluates Security Rules on the service. Client configuration is not the security boundary. The included rules are intentionally minimal and educational. They allow signed-in reads, allow a signed-in user to create a non-empty string message attributed to their own UID, allow authors to delete their own messages, and deny updates by omission. Message deletion is not part of the UI exercise.

## Testing

Unit tests use mocked Firebase SDK functions or mocked service modules. They make no network calls, require no Firebase project or `.env`, and do not write to the live class Firebase project. Tests cover configuration's duplicate-initialization guard, auth UI and operations, message writes/reads, document IDs, realtime updates, and listener cleanup. `npm run test:infrastructure` checks starter setup independently from unfinished product features.

Real-device/manual verification is still needed to confirm cross-client realtime behavior against a configured Firebase project. Open the app on two clients signed into different accounts, send a message from one, and check that it appears on the other without refreshing.

## Working with a coding agent

AI is useful as a collaborator and explainer; use the tests and progress checker to review its work. Example prompts:

- “Explain this TODO without writing code yet.”
- “Tell me what data enters and leaves this function.”
- “Implement only PART 4 and do not alter other parts.”
- “Review this effect for a leaked listener.”
- “Explain the test failure in plain language.”
- “Propose a Firestore model for our group prototype before coding.”

You must be able to identify the authentication observer, Firestore write, one-time read, realtime listener, and cleanup function in your completed code.
