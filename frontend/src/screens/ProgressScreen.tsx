import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const SUBJECTS = [
  { name: 'Advanced Mathematics', progress: 78, color: '#6366f1', status: '✅ Exam in 14 days — on track' },
  { name: 'Data Structures', progress: 61, color: '#8b5cf6', status: '📋 Lab report due Friday' },
  { name: 'English Writing', progress: 42, color: '#22c55e', status: '⚠️ Behind schedule — add 2h this week', warning: true },
  { name: 'Physics', progress: 55, color: '#14b8a6', status: '👍 Good pace — continue current schedule' },
];

const HEATMAP_WEEKS = 14;
const HEATMAP_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function ProgressScreen() {
  const { colors } = useTheme();
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);

  useEffect(() => {
    const data = Array.from({ length: HEATMAP_DAYS.length }, () =>
      Array.from({ length: HEATMAP_WEEKS }, () => Math.random())
    );
    setHeatmapData(data);
  }, []);

  const getHeatmapOpacity = (value: number) => {
    if (value < 0.12) return 0.06;
    if (value < 0.3) return 0.2;
    if (value < 0.55) return 0.45;
    if (value < 0.8) return 0.72;
    return 1;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.navy, paddingTop: 60, paddingBottom: 20 }]}>
        <Text style={styles.headerTitle}>Your Progress</Text>
      </View>

      <View style={styles.statsGrid}>
        {[
          { value: '28.4h', label: 'This week ⏱️' },
          { value: '12', label: 'Day streak 🔥' },
          { value: '247', label: 'Cards mastered 🧠' },
          { value: '3.8', label: 'Predicted GPA 🎓' },
        ].map((stat, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Weekly study hours</Text>
      <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.chartPlaceholder}>
          <Text style={[styles.chartText, { color: colors.textSecondary }]}>📊 Study Hours Chart</Text>
          <Text style={[styles.chartSub, { color: colors.textTertiary }]}>Mon: 2.5h · Tue: 3.8h · Wed: 4.2h · Thu: 1.5h · Fri: 3.0h · Sat: 5.5h · Sun: 4.1h</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Subject progress</Text>
      {SUBJECTS.map((subject, i) => (
        <View key={i} style={[styles.subjectCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.subjectHead}>
            <View style={[styles.subjectDot, { backgroundColor: subject.color }]} />
            <Text style={[styles.subjectName, { color: colors.text }]}>{subject.name}</Text>
            <Text style={[styles.subjectPct, { color: subject.color }]}>{subject.progress}%</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.surface3 }]}>
            <View style={[styles.progressFill, { width: `${subject.progress}%`, backgroundColor: subject.color }]} />
          </View>
          <Text style={[styles.statusText, { color: subject.warning ? '#92400e' : '#15803d' }]}>{subject.status}</Text>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Study heatmap</Text>
      <View style={[styles.heatmapWrap, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
        <Text style={[styles.heatmapTitle, { color: colors.textSecondary }]}>Study activity — past 14 weeks</Text>
        <View style={styles.heatmapGrid}>
          <View style={styles.heatmapLabels}>
            {HEATMAP_DAYS.map((day, i) => (
              <Text key={i} style={[styles.heatmapLabel, { color: colors.textTertiary }]}>{day}</Text>
            ))}
          </View>
          {heatmapData.map((row, dayIndex) => (
            <View key={dayIndex} style={styles.heatmapCol}>
              {row.map((value, weekIndex) => (
                <View
                  key={weekIndex}
                  style={[styles.heatmapCell, { backgroundColor: colors.primary, opacity: getHeatmapOpacity(value) }]}
                />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.heatmapLegend}>
          <Text style={[styles.legendText, { color: colors.textTertiary }]}>Less</Text>
          {[0.06, 0.2, 0.45, 0.72, 1].map((op, i) => (
            <View key={i} style={[styles.legendCell, { backgroundColor: colors.primary, opacity: op }]} />
          ))}
          <Text style={[styles.legendText, { color: colors.textTertiary }]}>More</Text>
        </View>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 14 },
  statCard: { width: (width - 44) / 2, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  chartCard: { marginHorizontal: 14, padding: 14, borderRadius: 20, borderWidth: 1 },
  chartPlaceholder: { height: 180, justifyContent: 'center', alignItems: 'center' },
  chartText: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  chartSub: { fontSize: 12, textAlign: 'center', paddingHorizontal: 20 },
  subjectCard: { marginHorizontal: 14, marginBottom: 10, padding: 16, borderRadius: 18, borderWidth: 1 },
  subjectHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  subjectDot: { width: 10, height: 10, borderRadius: 5 },
  subjectName: { fontSize: 14, fontWeight: '700', flex: 1 },
  subjectPct: { fontSize: 14, fontWeight: '700' },
  progressTrack: { height: 5, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  statusText: { fontSize: 12, marginTop: 8 },
  heatmapWrap: { marginHorizontal: 14, padding: 16, borderRadius: 20, borderWidth: 1 },
  heatmapTitle: { fontSize: 13, fontWeight: '700', marginBottom: 12 },
  heatmapGrid: { flexDirection: 'row', gap: 3 },
  heatmapLabels: { marginRight: 6 },
  heatmapLabel: { fontSize: 10, height: 14, textAlign: 'right', marginBottom: 3, width: 16 },
  heatmapCol: { gap: 3 },
  heatmapCell: { width: 14, height: 14, borderRadius: 3 },
  heatmapLegend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12, justifyContent: 'flex-end' },
  legendText: { fontSize: 10 },
  legendCell: { width: 14, height: 14, borderRadius: 3 },
});
