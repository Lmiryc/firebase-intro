import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AuthPanel({ onSignUp, onSignIn, busy, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Welcome to the message board</Text>
      <Text style={styles.help}>Create an account or sign in to join the conversation.</Text>
      <TextInput
        accessibilityLabel="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        value={email}
      />
      <TextInput
        accessibilityLabel="Password"
        autoCapitalize="none"
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
      />
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {busy ? <ActivityIndicator accessibilityLabel="Authentication in progress" /> : null}
      <Pressable accessibilityRole="button" disabled={busy} onPress={() => onSignUp(email, password)} style={styles.primaryButton}>
        <Text style={styles.buttonText}>Create account</Text>
      </Pressable>
      <Pressable accessibilityRole="button" disabled={busy} onPress={() => onSignIn(email, password)} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Sign in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: 12 },
  title: { color: '#19233b', fontSize: 21, fontWeight: '700' },
  help: { color: '#5f6b83', fontSize: 15, lineHeight: 22 },
  input: { backgroundColor: '#fff', borderColor: '#dce2ee', borderRadius: 10, borderWidth: 1, padding: 14 },
  error: { color: '#a32d32' },
  primaryButton: { alignItems: 'center', backgroundColor: '#4358d5', borderRadius: 10, padding: 14 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', borderColor: '#4358d5', borderRadius: 10, borderWidth: 1, padding: 14 },
  secondaryButtonText: { color: '#3448c0', fontSize: 16, fontWeight: '700' },
});
