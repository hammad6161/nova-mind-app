import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧠 Nova Mind</Text>
        <Text style={styles.subtitle}>Your AI Study Planner</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome!</Text>
        <Text style={styles.cardText}>Start learning smarter today.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 24, backgroundColor: '#6C63FF', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 16, color: '#fff', marginTop: 4 },
  card: { margin: 16, padding: 20, backgroundColor: '#fff', borderRadius: 12 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  cardText: { fontSize: 14, color: '#666', marginTop: 8 },
});
