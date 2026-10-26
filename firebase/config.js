import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ======================================================
// PART 1 — CONFIGURE AND INITIALIZE FIREBASE
//
// WHY: Auth and Firestore both need a configured Firebase app.
// PRODUCT QUESTION: Which project should a prototype's data belong to?
// DO: Copy .env.example to .env, add your web config, then complete initialization.
// CODE TO COMPLETE: the imports and setup are intentionally not enabled yet.
// ```js
// import the app, auth, and firestore setup helpers from the Firebase Web SDK.
// Read all six EXPO_PUBLIC_FIREBASE_* values into a config object.
// Guard initialization so Expo Fast Refresh does not create duplicate apps.
// ```
// VERIFY: Run `npm start`; the screen should render without an initialization error.
// NEXT: Search for "PART 2 — OBSERVE AUTHENTICATION STATE" in App.js.
// ======================================================




// TODO PART 1:
//  - Uncomment import
//  - Uncomment config object replace these placeholders with the initialized Firebase clients.
 const firebaseConfig = {
     apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
     authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
     storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
 };


// The starter screen does not import Firebase yet, so it remains launchable.
export const app =  getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const db = getFirestore(app);
