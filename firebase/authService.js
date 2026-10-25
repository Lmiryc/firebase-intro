// ======================================================
// PART 2 - OBSERVE AUTHENTICATION STATE
//
// WHY: Firebase restores a saved sign-in asynchronously.
// PRODUCT QUESTION: What should a returning visitor see while we wait?
// DO: Uncomment the PART 2 import and return line below.
// VERIFY: The app stops showing “Checking authentication” and shows signed-out status.
// NEXT: Search for "PART 3 - SIGN UP, SIGN IN, AND SIGN OUT" below.
// ======================================================

// PART 2 - Uncomment this import and the auth import below:
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './config';

// PART 3 - Uncomment this import when you reach the auth buttons:
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
// } from 'firebase/auth';

export function observeAuthState(callback) {
  // Uncomment this line to connect the screen to Firebase Auth:
  // return onAuthStateChanged(auth, callback);
  throw new Error('PART 2 is not complete: observe authentication state.');
}

// ======================================================
// PART 3 - SIGN UP, SIGN IN, AND SIGN OUT
//
// WHY: Firebase Authentication gives each participant an identity.
// PRODUCT QUESTION: Can a signed-out visitor join or post?
// DO: Uncomment the matching return line in each function above/below.
// VERIFY: Create an account, sign out, then sign in with that account.
// NEXT: Search for "PART 4 - CREATE A MESSAGE" in messageService.js.
// ======================================================

export function signUp(email, password) {
  // Uncomment this line to enable the Create account button:
  // return createUserWithEmailAndPassword(auth, email, password);
  throw new Error('PART 3 is not complete: create an account.');
}

export function signIn(email, password) {
  // Uncomment this line to enable the Sign in button:
  // return signInWithEmailAndPassword(auth, email, password);
  throw new Error('PART 3 is not complete: sign in.');
}

export function signOutCurrentUser() {
  // Uncomment this line to enable the Sign out button:
  // return signOut(auth);
  throw new Error('PART 3 is not complete: sign out.');
}
