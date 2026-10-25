import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

function MessageCard({ message }) {
  return (
    <View style={styles.card}>
      <Text style={styles.message}>{message.text}</Text>
      <Text style={styles.author}>{message.authorEmail || 'A community member'}</Text>
    </View>
  );
}

export default function MessageList({ messages, loading, error }) {
  if (loading) return <Text style={styles.status}>Loading messages…</Text>;
  if (error) return <Text accessibilityRole="alert" style={styles.error}>Messages could not be loaded: {error}</Text>;
  if (messages.length === 0) return <Text style={styles.status}>No messages yet. Start the conversation!</Text>;

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={messages}
      keyExtractor={message => message.id}
      renderItem={({ item }) => <MessageCard message={item} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, paddingBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14 },
  message: { color: '#19233b', fontSize: 16, lineHeight: 22 },
  author: { color: '#66728a', fontSize: 12, marginTop: 8 },
  status: { color: '#5f6b83', fontSize: 15, paddingVertical: 14 },
  error: { color: '#a32d32', paddingVertical: 14 },
});
