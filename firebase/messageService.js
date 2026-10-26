// PARTS 4–6 - Uncomment this import block as you reach each part.
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

// ======================================================
// PART 4 - CREATE A MESSAGE
//
// WHY: A Firestore document stores the text and who sent it.
// PRODUCT QUESTION: Which author details help people trust a message?
// DO: Uncomment the import block above and the addDoc block below.
//     The trim and empty-message checks are already active.
// VERIFY: Send a message and inspect its fields in Firebase Console.
// NEXT: Search for "PART 5 - READ MESSAGES ONCE" below.
// ======================================================
export async function createMessage({ text, user }) {
  const trimmedText = text.trim();
  if (!trimmedText) {
    throw new Error('Write a message before sending.');
  }
  if (!user) {
    throw new Error('Sign in before sending a message.');
  }

  // Uncomment this block to create the Firestore document:
  return addDoc(collection(db, 'messages'), {
    text: trimmedText,
    authorId: user.uid,
    authorEmail: user.email,
    createdAt: serverTimestamp(),
  });
  throw new Error('PART 4 is not complete: create a message.');
}

// ======================================================
// PART 5 - READ MESSAGES ONCE
//
// WHY: getDocs() gives us a photograph of the collection.
// PRODUCT QUESTION: Is a refresh enough for a live conversation?
// DO: Uncomment the block below. Keep this demonstration after Part 6.
// VERIFY: Existing messages appear when the signed-in board loads.
// NEXT: Search for "PART 6 - REALTIME MESSAGE SUBSCRIPTION" below.
// ======================================================
export async function loadMessagesOnce() {
  // Uncomment this block for the one-time read:
  const messagesQuery = query(
    collection(db, 'messages'),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(messagesQuery);
  return snapshot.docs.map(documentSnapshot => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }));
  throw new Error('PART 5 is not complete: read messages once.');
}

// ======================================================
// PART 6 - REALTIME MESSAGE SUBSCRIPTION
//
// WHY: onSnapshot() keeps the list current without refreshing.
// PRODUCT QUESTION: How quickly should a new message appear for others?
// DO: Uncomment the listener block below. It reports both data and errors.
//     Let the screen's FlatList own vertical scrolling; don't nest it in a ScrollView.
// VERIFY: Two signed-in clients see a new message without refreshing.
// NEXT: Search for "PART 7 - CLEAN UP THE SUBSCRIPTION" in App.js.
// ======================================================
export function subscribeToMessages(onMessages, onError) {
  // Uncomment this block to subscribe to live changes:
  const messagesQuery = query(
    collection(db, 'messages'),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(
    messagesQuery,
    snapshot => {
      const nextMessages = snapshot.docs.map(documentSnapshot => ({
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      }));
      onMessages(nextMessages);
    },
    onError,
  );
  throw new Error('PART 6 is not complete: subscribe to message updates.');
}
