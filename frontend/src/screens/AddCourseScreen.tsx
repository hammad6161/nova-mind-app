import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function AddCourseScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [examDate, setExamDate] = useState('');
  const [weeklyHours, setWeeklyHours] = useState('');
  const [deadlines, setDeadlines] = useState('');
  const [notes, setNotes] = useState('');

  const difficulties = ['Easy', 'Medium', 'Hard', 'Very Hard'];

  const generateSchedule = () => {
    navigation.navigate('Schedule');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.navy, paddingTop: 60, paddingBottom: 20 }]}>
        <Text style={styles.headerTitle}>Add Course</Text>
        <Text style={styles.headerSub}>AI schedule</Text>
      </View>

      <View style={styles.form}>
        <Text style={[styles.formDesc, { color: colors.textSecondary }]}>
          Fill in your course details and AI will automatically build your optimised study schedule.
        </Text>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Course name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="e.g. Advanced Mathematics"
            placeholderTextColor={colors.textTertiary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Difficulty</Text>
          <View style={styles.difficultyRow}>
            {difficulties.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.difficultyBtn, difficulty === d && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => setDifficulty(d)}
              >
                <Text style={[styles.difficultyText, difficulty === d && { color: '#fff' }]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Exam date</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textTertiary}
            value={examDate}
            onChangeText={setExamDate}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Weekly study hours</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="e.g. 6"
            placeholderTextColor={colors.textTertiary}
            value={weeklyHours}
            onChangeText={setWeeklyHours}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Upcoming deadlines</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="e.g. Assignment 1 — Apr 20"
            placeholderTextColor={colors.textTertiary}
            value={deadlines}
            onChangeText={setDeadlines}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Notes / goals</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="e.g. Focus on exam past papers"
            placeholderTextColor={colors.textTertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={generateSchedule}>
          <Ionicons name="sparkles" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.submitBtnText}>Generate AI schedule</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 },
  form: { padding: 18 },
  formDesc: { fontSize: 14, lineHeight: 22, marginBottom: 20 },
  formGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  input: { padding: 14, borderRadius: 14, borderWidth: 1.5, fontSize: 15 },
  difficultyRow: { flexDirection: 'row', gap: 8 },
  difficultyBtn: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#e2e8f0', alignItems: 'center' },
  difficultyText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, marginTop: 8 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
