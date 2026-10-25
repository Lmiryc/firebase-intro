import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { observeAuthState, signIn, signOutCurrentUser, signUp } from './firebase/authService';
import { createMessage, subscribeToMessages } from './firebase/messageService';
import AuthPanel from './components/AuthPanel';
import MessageComposer from './components/MessageComposer';
import MessageList from './components/MessageList';

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messageError, setMessageError] = useState('');
  const [sending, setSending] = useState(false);

  // PART 2 — OBSERVE AUTHENTICATION STATE
  // Firebase checks for a saved session asynchronously; render neither state too early.
  useEffect(() => {
    const unsubscribe = observeAuthState(nextUser => {
      setUser(nextUser);
      setAuthReady(true);
    });

    // PART 7 — CLEAN UP SUBSCRIPTIONS: stop observing auth when this screen leaves.
    return unsubscribe;
  }, []);

  // PART 6 — REALTIME MESSAGE SUBSCRIPTION
  // User-scoped effect means signed-out users do not subscribe to the board.
  useEffect(() => {
    if (!user) {
      setMessages([]);
      setMessagesLoading(false);
      return undefined;
    }

    setMessagesLoading(true);
    setMessageError('');
    const unsubscribe = subscribeToMessages(
      nextMessages => {
        setMessages(nextMessages);
        setMessagesLoading(false);
      },
      error => {
        setMessageError(error.message || 'Please try again.');
        setMessagesLoading(false);
      },
    );

    // PART 7 — CLEAN UP SUBSCRIPTIONS: React calls this when user changes or screen leaves.
    return unsubscribe;
  }, [user]);

  async function handleAuth(operation, email = '', password = '') {
    setAuthBusy(true);
    setAuthError('');
    try {
      await operation(email.trim(), password);
    } catch (error) {
      setAuthError(error.message || 'We could not sign you in. Please try again.');
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSend(text) {
    setSending(true);
    setMessageError('');
    try {
      // PART 4 — CREATE A MESSAGE associated with the signed-in user.
      await createMessage({ text, user });
      return true;
    } catch (error) {
      setMessageError(error.message || 'Your message could not be sent.');
      return false;
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>A SMALL FIREBASE CODE TOUR</Text>
        <Text style={styles.heading}>Firebase tour</Text>
        <Text style={styles.intro}>A shared message board, powered by Authentication and live Firestore updates.</Text>

        {!authReady ? (
          <View style={styles.loading}>
            <ActivityIndicator accessibilityLabel="Checking authentication" />
            <Text style={styles.muted}>Checking your sign-in…</Text>
          </View>
        ) : user ? (
          <View style={styles.board}>
            <View style={styles.userRow}>
              <View style={styles.userCopy}>
                <Text style={styles.sectionTitle}>You’re signed in</Text>
                <Text style={styles.muted}>{user.email}</Text>
              </View>
              <Pressable accessibilityRole="button" disabled={authBusy} onPress={() => handleAuth(signOutCurrentUser)} style={styles.signOut}>
                <Text style={styles.signOutText}>{authBusy ? 'Please wait…' : 'Sign out'}</Text>
              </Pressable>
            </View>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Community messages</Text>
            <MessageComposer onSend={handleSend} busy={sending} error={messageError} />
            <MessageList error={messageError} loading={messagesLoading} messages={messages} />
          </View>
        ) : (
          <AuthPanel
            busy={authBusy}
            error={authError}
            onSignIn={(email, password) => handleAuth(signIn, email, password)}
            onSignUp={(email, password) => handleAuth(signUp, email, password)}
          />
        )}
        <Text style={styles.footer}>Authentication decides who can join. Firestore Rules decide what each signed-in person is allowed to do.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f4f6fb', flex: 1 },
  content: { gap: 14, padding: 22, paddingTop: 34 },
  eyebrow: { color: '#4358d5', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  heading: { color: '#19233b', fontSize: 32, fontWeight: '800' },
  intro: { color: '#5f6b83', fontSize: 16, lineHeight: 23, marginBottom: 8 },
  loading: { alignItems: 'center', flexDirection: 'row', gap: 10, minHeight: 100 },
  muted: { color: '#5f6b83', fontSize: 14 },
  board: { gap: 14 },
  userRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  userCopy: { gap: 4 },
  sectionTitle: { color: '#19233b', fontSize: 18, fontWeight: '700' },
  signOut: { borderColor: '#dce2ee', borderRadius: 9, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9 },
  signOutText: { color: '#3448c0', fontWeight: '600' },
  divider: { backgroundColor: '#dce2ee', height: 1, marginVertical: 3 },
  footer: { color: '#778198', fontSize: 12, lineHeight: 18, marginTop: 18 },
});
