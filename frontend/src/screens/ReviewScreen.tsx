import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface Card {
  id: string;
  question: string;
  answer: string;
  subject: string;
}

const CARDS: Card[] = [
  { id: '1', question: 'What is the time complexity of BFS on a graph with V vertices and E edges?', answer: 'O(V + E) — BFS visits each vertex once O(V) and traverses each edge once O(E), so total is O(V+E).', subject: 'Data Structures' },
  { id: '2', question: 'What data structure does DFS use internally (or implicitly)?', answer: 'A stack — either an explicit stack or the program's call stack during recursive DFS.', subject: 'Data Structures' },
  { id: '3', question: 'Define a Binary Search Tree (BST) and its key property.', answer: 'A binary tree where for every node: all left subtree values < node value < all right subtree values.', subject: 'Data Structures' },
  { id: '4', question: 'What is amortised analysis and when is it used?', answer: 'Averaging the time cost across a sequence of operations. Used when individual operations can vary (e.g. dynamic arrays — most O(1), resize is O(n)).', subject: 'Data Structures' },
  { id: '5', question: 'What distinguishes a connected graph from a disconnected graph?', answer: 'Connected: a path exists between every pair of vertices. Disconnected: at least one pair of vertices has no path between them.', subject: 'Data Structures' },
  { id: '6', question: 'What is the difference between a graph and a tree?', answer: 'A tree is a connected, acyclic graph with exactly N-1 edges for N nodes. A general graph may have cycles and disconnected components.', subject: 'Data Structures' },
  { id: '7', question: 'What is Dijkstra's algorithm used for?', answer: 'Finding the shortest path from a single source to all other vertices in a weighted graph with non-negative edges. Time: O((V+E) log V) with min-heap.', subject: 'Data Structures' },
  { id: '8', question: 'What is the space complexity of an adjacency matrix vs adjacency list?', answer: 'Matrix: O(V²) — good for dense graphs. List: O(V+E) — better for sparse graphs.', subject: 'Data Structures' },
];

export default function ReviewScreen() {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ easy: 0, ok: 0, hard: 0 });

  const currentCard = CARDS[currentIndex];
  const totalReviewed = stats.easy + stats.ok + stats.hard;
  const progress = ((totalReviewed) / CARDS.length) * 100;

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const rateCard = (rating: 'easy' | 'ok' | 'hard') => {
    setStats(prev => ({ ...prev, [rating]: prev[rating] + 1 }));
    setIsFlipped(false);
    if (currentIndex < CARDS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.navy, paddingTop: 60, paddingBottom: 20 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Spaced Review</Text>
            <Text style={styles.headerSub}>Data Structures</Text>
          </View>
          <View style={styles.cardCounter}>
            <Text style={styles.cardNum}>{Math.min(currentIndex + 1, CARDS.length)}/{CARDS.length}</Text>
            <Text style={styles.cardLabel}>cards</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: '#4ade80' }]}>{stats.easy}</Text>
            <Text style={styles.statLabel}>Easy ✅</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: '#fbbf24' }]}>{stats.ok}</Text>
            <Text style={styles.statLabel}>OK 🤔</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: '#f87171' }]}>{stats.hard}</Text>
            <Text style={styles.statLabel}>Hard 😅</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: 'rgba(255,255,255,0.7)' }]}>{totalReviewed}</Text>
            <Text style={styles.statLabel}>Reviewed</Text>
          </View>
        </View>

        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.secondary }]} />
        </View>
      </View>

      <Text style={[styles.flipHint, { color: colors.textTertiary }]}>Tap card to flip 👆</Text>

      <TouchableOpacity style={styles.cardScene} onPress={flipCard} activeOpacity={0.9}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {!isFlipped ? (
            <>
              <Text style={[styles.cardLabelSmall, { color: colors.textTertiary }]}>Question</Text>
              <Text style={[styles.cardQuestion, { color: colors.text }]}>{currentCard.question}</Text>
              <Text style={[styles.cardHint, { color: colors.textTertiary }]}>Tap to reveal answer</Text>
            </>
          ) : (
            <>
              <Text style={[styles.cardLabelSmall, { color: colors.secondary }]}>Answer ✓</Text>
              <Text style={[styles.cardAnswer, { color: colors.secondary }]}>{currentCard.answer}</Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {isFlipped ? (
        <View style={styles.rateRow}>
          <TouchableOpacity style={[styles.rateBtn, { backgroundColor: '#fef2f2' }]} onPress={() => rateCard('hard')}>
            <Text style={[styles.rateBtnText, { color: '#b91c1c' }]}>😅 Hard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.rateBtn, { backgroundColor: '#fffbeb' }]} onPress={() => rateCard('ok')}>
            <Text style={[styles.rateBtnText, { color: '#92400e' }]}>🤔 OK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.rateBtn, { backgroundColor: '#f0fdf4' }]} onPress={() => rateCard('easy')}>
            <Text style={[styles.rateBtnText, { color: '#15803d' }]}>✅ Easy</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.revealArea}>
          <TouchableOpacity style={[styles.revealBtn, { backgroundColor: colors.navy }]} onPress={flipCard}>
            <Text style={styles.revealBtnText}>Reveal answer →</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.aiInsight, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '20' }]}>
        <View style={[styles.aiBadge, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '25' }]}>
          <Ionicons name="sparkles" size={10} color={colors.primary} />
          <Text style={[styles.aiBadgeText, { color: colors.primary }]}>AI Insight</Text>
        </View>
        <Text style={[styles.aiInsightText, { color: colors.primaryDark }]}>
          Based on your history, you tend to forget graph traversal concepts after 3 days. Cards rated Easy will reappear in 2 days, OK in 1 day, Hard immediately tomorrow.
        </Text>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 18 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 },
  cardCounter: { alignItems: 'flex-end' },
  cardNum: { color: '#fff', fontSize: 24, fontWeight: '700' },
  cardLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  statsRow: { flexDirection: 'row', gap: 16, marginTop: 16 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 },
  progressBg: { height: 5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden', marginTop: 14 },
  progressFill: { height: '100%', borderRadius: 3 },
  flipHint: { textAlign: 'center', paddingVertical: 14, fontSize: 12 },
  cardScene: { marginHorizontal: 14, height: 220 },
  card: { flex: 1, borderRadius: 20, padding: 24, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  cardLabelSmall: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 },
  cardQuestion: { fontSize: 16, fontWeight: '700', textAlign: 'center', lineHeight: 24 },
  cardHint: { fontSize: 12, marginTop: 16 },
  cardAnswer: { fontSize: 14, fontWeight: '600', textAlign: 'center', lineHeight: 22 },
  rateRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingVertical: 10 },
  rateBtn: { flex: 1, padding: 14, borderRadius: 14 },
  rateBtnText: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  revealArea: { paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center' },
  revealBtn: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 24 },
  revealBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  aiInsight: { marginHorizontal: 14, marginTop: 14, padding: 16, borderRadius: 16, borderWidth: 1 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1, alignSelf: 'flex-start', marginBottom: 10 },
  aiBadgeText: { fontSize: 10, fontWeight: '700' },
  aiInsightText: { fontSize: 13, lineHeight: 20 },
});
