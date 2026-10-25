import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './config';

// PART 2 — OBSERVE AUTHENTICATION STATE
// WHY: Firebase restores an existing session asynchronously.
// DO: Subscribe once and return the SDK cleanup function to the screen.
export function observeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

// PART 3 — SIGN UP, SIGN IN, AND SIGN OUT
export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOutCurrentUser() {
  return signOut(auth);
}
