import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.eyebrow}>A SMALL FIREBASE CODE TOUR</Text>
          <Text style={styles.heading}>Firebase tour</Text>
          <Text style={styles.copy}>A shared message board. As you work through the parts below, this static screen will become a realtime app.</Text>

          <View style={styles.panel}>
            <Text style={styles.subheading}>Join the conversation</Text>
            <TextInput accessibilityLabel="Email" autoCapitalize="none" placeholder="Email" style={styles.input} />
            <TextInput accessibilityLabel="Password" placeholder="Password" secureTextEntry style={styles.input} />
            <Pressable accessibilityRole="button" style={styles.primary}><Text style={styles.primaryText}>Create account</Text></Pressable>
            <Pressable accessibilityRole="button" style={styles.secondary}><Text style={styles.secondaryText}>Sign in</Text></Pressable>
          </View>

          <View style={styles.panel}>
            <Text style={styles.subheading}>Community messages</Text>
            <Text style={styles.copy}>Messages will appear here after the read and realtime-listener parts.</Text>
            <TextInput accessibilityLabel="Message" placeholder="Write a message..." style={styles.input} />
            <Pressable accessibilityRole="button" style={styles.primary}><Text style={styles.primaryText}>Send</Text></Pressable>
          </View>
          <Text style={styles.footer}>Authentication decides who can join. Firebase Security Rules decide what signed-in people may do.</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ======================================================
// PART 2 — OBSERVE AUTHENTICATION STATE
//
// WHY: Firebase needs a moment to restore a saved sign-in.
// PRODUCT QUESTION: What should returning visitors see while we wait?
// DO: Subscribe in an effect, update user/readiness state, and clean up.
// CODE TO COMPLETE (not a copy/paste solution):
// ```js
// useEffect(() => {
//   // TODO: call the auth observer and update both pieces of state.
//   // TODO: return the observer's cleanup function.
// }, []);
// ```
// VERIFY: A signed-out visitor sees account controls; a signed-in visitor sees their email.
// NEXT: Search for "PART 3 — AUTHENTICATION ACTIONS" in firebase/authService.js.
// ======================================================

// ======================================================
// PART 7 — CLEAN UP REALTIME SUBSCRIPTIONS
//
// WHY: Leaving an old listener active can waste work and duplicate updates.
// PRODUCT QUESTION: Should a screen keep listening after the user leaves it?
// DO: Return each subscription's cleanup function from the effect that created it.
// CODE TO COMPLETE:
// ```js
// useEffect(() => {
//   // TODO: keep the returned unsubscribe function and return it here.
// }, [user]);
// ```
// VERIFY: Unmounting the screen stops the auth and message listeners.
// NEXT: Search for "PART 8 — SECURITY RULES" in firestore.rules.
// ======================================================

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f4f6fb', flex: 1 },
  content: { gap: 16, padding: 22, paddingTop: 34 },
  eyebrow: { color: '#4358d5', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  heading: { color: '#19233b', fontSize: 32, fontWeight: '800' },
  copy: { color: '#5f6b83', fontSize: 15, lineHeight: 22 },
  panel: { backgroundColor: '#fff', borderRadius: 12, gap: 12, padding: 16 },
  subheading: { color: '#19233b', fontSize: 18, fontWeight: '700' },
  input: { backgroundColor: '#fff', borderColor: '#dce2ee', borderRadius: 9, borderWidth: 1, padding: 13 },
  primary: { alignItems: 'center', backgroundColor: '#4358d5', borderRadius: 9, padding: 13 },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: { alignItems: 'center', borderColor: '#4358d5', borderRadius: 9, borderWidth: 1, padding: 13 },
  secondaryText: { color: '#3448c0', fontWeight: '700' },
  footer: { color: '#778198', fontSize: 12, lineHeight: 18 },
});
