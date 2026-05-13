import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ScheduleScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 Schedule</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Study Schedule</Text>
        <Text style={styles.cardText}>AI-generated study plans will appear here.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 24, backgroundColor: '#6C63FF', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  card: { margin: 16, padding: 20, backgroundColor: '#fff', borderRadius: 12 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  cardText: { fontSize: 14, color: '#666', marginTop: 8 },
});
