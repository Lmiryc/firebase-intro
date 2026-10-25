import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function MessageComposer({ onSend, busy, error }) {
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0 && !busy;

  async function submitMessage() {
    if (!canSend) return;
    const wasSent = await onSend(text);
    if (wasSent) setText('');
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <TextInput
          accessibilityLabel="Message"
          onChangeText={setText}
          onSubmitEditing={submitMessage}
          placeholder="Write a message..."
          returnKeyType="send"
          style={styles.input}
          value={text}
        />
        <Pressable accessibilityRole="button" disabled={!canSend} onPress={submitMessage} style={[styles.button, !canSend && styles.disabled]}>
          <Text style={styles.buttonText}>Send</Text>
        </Pressable>
      </View>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  input: { backgroundColor: '#fff', borderColor: '#dce2ee', borderRadius: 10, borderWidth: 1, flex: 1, padding: 13 },
  button: { backgroundColor: '#4358d5', borderRadius: 10, paddingHorizontal: 17, paddingVertical: 14 },
  disabled: { backgroundColor: '#aab2d8' },
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { color: '#a32d32' },
});
