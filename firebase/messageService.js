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

const messagesCollection = collection(db, 'messages');

// PART 4 — CREATE AN AUTHENTICATED MESSAGE
// WHY: A document stores the message plus the identity that sent it.
// VERIFY: Check the messages collection in Firebase Console after sending.
export async function createMessage({ text, user }) {
  const trimmedText = text.trim();
  if (!trimmedText) {
    throw new Error('Write a message before sending.');
  }
  if (!user) {
    throw new Error('Sign in before sending a message.');
  }

  return addDoc(collection(db, 'messages'), {
    text: trimmedText,
    authorId: user.uid,
    authorEmail: user.email,
    createdAt: serverTimestamp(),
  });
}

function messagesByNewestFirst() {
  return query(messagesCollection, orderBy('createdAt', 'desc'));
}

function mapMessageDocuments(snapshot) {
  return snapshot.docs.map(documentSnapshot => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }));
}

// PART 5 — READ MESSAGES ONCE (DEMONSTRATION)
// WHY: getDocs() takes a photograph; it does not keep the screen current.
// Kept as a named demonstration after PART 6 replaces it in the app.
export async function loadMessagesOnce() {
  const snapshot = await getDocs(messagesByNewestFirst());
  return mapMessageDocuments(snapshot);
}

// PART 6 — SUBSCRIBE TO REALTIME UPDATES
// The returned SDK function is the cleanup that PART 7 uses in the effect.
export function subscribeToMessages(onMessages, onError) {
  return onSnapshot(
    messagesByNewestFirst(),
    snapshot => onMessages(mapMessageDocuments(snapshot)),
    onError,
  );
}
