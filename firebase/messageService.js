// ======================================================
// PART 4 — CREATE A MESSAGE
//
// WHY: A Firestore document stores both the text and who sent it.
// PRODUCT QUESTION: Which author details help people trust a shared message?
// DO: Write to the top-level "messages" collection. Trim/reject blank text and
//     include the signed-in user's uid/email plus a server-generated time.
// CODE TO COMPLETE:
// ```js
// export async function createMessage({ text, user }) {
//   // TODO: build the document data and call Firestore's add-document operation.
// }
// ```
// VERIFY: Send one message and inspect its fields in Firebase Console.
// NEXT: Search for "PART 5 — READ MESSAGES ONCE" below.
// ======================================================
export async function createMessage({ text, user }) {
  // TODO PART 4: implement an authenticated Firestore create operation.
  throw new Error('PART 4 is not complete: create a message.');
}

// ======================================================
// PART 5 — READ MESSAGES ONCE
//
// WHY: A one-time read is a useful photograph of the collection.
// PRODUCT QUESTION: Is a refresh button enough for a live conversation?
// DO: Query newest-first and map document IDs alongside document data.
// CODE TO COMPLETE:
// ```js
// export async function loadMessagesOnce() {
//   // TODO: use getDocs with query/orderBy; preserve each document's ID.
// }
// ```
// VERIFY: Existing messages appear after loading the board.
// NEXT: Search for "PART 6 — REALTIME MESSAGE SUBSCRIPTION" below.
// ======================================================
export async function loadMessagesOnce() {
  // TODO PART 5: demonstrate a one-time ordered collection read.
  throw new Error('PART 5 is not complete: read messages once.');
}

// ======================================================
// PART 6 — REALTIME MESSAGE SUBSCRIPTION
//
// WHY: A subscription keeps the list current without a refresh.
// PRODUCT QUESTION: How much faster should a collaborative prototype feel?
// DO: Subscribe to an ordered query, map document IDs, update the list, and
//     surface listener errors. The screen will own the returned cleanup.
//     Let a message FlatList own vertical scrolling; don't nest it in a ScrollView.
// CODE TO COMPLETE:
// ```js
// export function subscribeToMessages(onMessages, onError) {
//   // TODO: return the Firestore realtime listener's unsubscribe function.
// }
// ```
// VERIFY: Two signed-in clients should see a new message without refreshing.
// NEXT: Search for "PART 7 — CLEAN UP REALTIME SUBSCRIPTIONS" in App.js.
// ======================================================
export function subscribeToMessages(onMessages, onError) {
  // TODO PART 6: subscribe to the messages query and pass data/errors to callers.
  throw new Error('PART 6 is not complete: subscribe to message updates.');
}
