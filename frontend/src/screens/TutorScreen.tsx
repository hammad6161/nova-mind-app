import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  'Explain separable ODEs',
  'Practice problem',
  'Quick quiz',
  'Chapter summary',
  "Help, it's hard",
];

const AI_RESPONSES: Record<string, string> = {
  'explain separable odes': `Let me break that down step by step:

1️⃣ Identify the type of ODE (linear, separable, exact, homogeneous)
2️⃣ Choose the right method for that type
3️⃣ Solve — and don't forget the constant C

For a separable ODE like dy/dx = f(x)g(y):
• Separate: dy/g(y) = f(x)dx
• Integrate both sides
• Solve for y

Tip: Always check your answer by differentiating!`,
  'practice problem': `Here's a practice problem for you 🎯

Solve: dy/dx + 2y = 4e^x

This is a first-order linear ODE.
Step 1: Find integrating factor μ = e^(∫2dx) = e^(2x)
Step 2: Multiply both sides by μ
Step 3: The left side becomes d/dx[e^(2x)·y]
Step 4: Integrate both sides

Can you find the complete solution? Type your answer!`,
  'quick quiz': `⚡ Quick Quiz Time!

What is the general solution of dy/dx = ky?

a) y = kx + C
b) y = Ce^(kx) ← think about this one
c) y = k·ln(x) + C
d) y = Cx^k

Type a, b, c, or d and I'll explain why!`,
  'chapter summary': `📋 Chapter 7 Summary — Differential Equations:

• Separable ODEs: dy/g(y) = f(x)dx — integrate both sides
• Linear 1st order: y' + P(x)y = Q(x) — use integrating factor e^(∫P dx)
• Exact ODEs: M dx + N dy = 0, where ∂M/∂y = ∂N/∂x
• Bernoulli equations: reduce to linear via substitution v = y^(1-n)
• Homogeneous ODEs: use substitution y = vx

💡 Key tip: Always identify the type FIRST before choosing a method.`,
  "help, it's hard": `No worries, let's slow down! 😊

The core intuition for differential equations:

We're finding a FUNCTION whose derivatives satisfy a given relationship.

Think of dy/dx = y as asking:
'What function equals its own derivative?'

The answer: y = Ce^x

That's the whole game! Take any equation, find the function that makes it true.

Which specific step is confusing you? Let's tackle it together.`,
};

const DEFAULT_RESPONSES = [
  "Great question! The most common types in your exam are:

• Separable ODEs (easiest — split and integrate)
• Linear 1st order (need integrating factor)
• Exact equations (check ∂M/∂y = ∂N/∂x)

Being able to identify the type quickly is half the battle!",
  "Based on your study history, you previously found integrating factors tricky — want me to walk through that method again?

The formula is: μ(x) = e^(∫P(x)dx)

Once you have μ, multiply through and the left side becomes a derivative you can integrate directly.",
];

export default function TutorScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hi! I'm your AI study tutor 🤖 I can explain concepts, generate practice questions, quiz you, and summarise chapters. What do you need help with today?", isUser: false, timestamp: new Date() },
    { id: '2', text: "You're studying Differential Equations today. Try asking me to explain a concept, give you a quiz, or show a chapter summary.", isUser: false, timestamp: new Date() },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const scrollViewRef = useRef<ScrollView>(null);
  let responseIndex = 0;

  const getAIResponse = (msg: string): string => {
    const lower = msg.toLowerCase();
    for (const [key, response] of Object.entries(AI_RESPONSES)) {
      if (lower.includes(key)) return response;
    }
    return DEFAULT_RESPONSES[responseIndex++ % DEFAULT_RESPONSES.length];
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(text),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  };

  const tabs = [
    { id: 'chat', label: '💬 Chat' },
    { id: 'practice', label: '🎯 Practice' },
    { id: 'summary', label: '📋 Summary' },
    { id: 'quiz', label: '⚡ Quiz' },
  ];

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { backgroundColor: colors.navy, paddingTop: 60, paddingBottom: 16 }]}>
        <View style={[styles.topicBar, { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.1)' }]}>
          <Text style={styles.topicText}>Advanced Mathematics · Ch.7 Differential Equations</Text>
          <View style={[styles.aiBadge, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '30' }]}>
            <Ionicons name="sparkles" size={9} color={colors.primary} />
            <Text style={[styles.aiBadgeText, { color: colors.primary }]}>AI</Text>
          </View>
        </View>
        <View style={styles.tabs}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tutorTab, activeTab === tab.id && { backgroundColor: '#fff', borderColor: '#fff' }]}
              onPress={() => {
                setActiveTab(tab.id);
                if (tab.id !== 'chat') sendMessage(tab.label);
              }}
            >
              <Text style={[styles.tutorTabText, activeTab === tab.id && { color: colors.navy }]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatBody}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <Animated.View key={msg.id} entering={FadeInUp.duration(300)}>
            <View style={[
              styles.bubble,
              msg.isUser ? [styles.bubbleUser, { backgroundColor: colors.primary }] : [styles.bubbleAI, { backgroundColor: colors.surface2, borderColor: colors.border }]
            ]}>
              <Text style={[styles.bubbleText, msg.isUser ? { color: '#fff' } : { color: colors.text }]}>
                {msg.text}
              </Text>
            </View>
          </Animated.View>
        ))}
        {isTyping && (
          <View style={[styles.thinking, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
            <View style={styles.dot} />
            <View style={[styles.dot, { marginLeft: 4 }]} />
            <View style={[styles.dot, { marginLeft: 4 }]} />
          </View>
        )}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPrompts}>
        {QUICK_PROMPTS.map((prompt, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.qpBtn, { backgroundColor: colors.surface2, borderColor: colors.border }]}
            onPress={() => sendMessage(prompt)}
          >
            <Text style={[styles.qpBtnText, { color: colors.textSecondary }]}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.inputBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          style={[styles.chatInput, { backgroundColor: colors.surface2, color: colors.text, borderColor: colors.border }]}
          placeholder="Ask anything..."
          placeholderTextColor={colors.textTertiary}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => sendMessage(inputText)}
          returnKeyType="send"
        />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]} onPress={() => sendMessage(inputText)}>
          <Ionicons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16 },
  topicBar: { borderRadius: 12, padding: 10, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1 },
  topicText: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  aiBadgeText: { fontSize: 10, fontWeight: '700' },
  tabs: { flexDirection: 'row', gap: 6, marginTop: 12 },
  tutorTab: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)' },
  tutorTabText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.45)' },
  chatBody: { flex: 1, padding: 14, paddingBottom: 8 },
  bubble: { padding: 12, borderRadius: 18, maxWidth: '88%', marginBottom: 10 },
  bubbleUser: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleAI: { alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1 },
  bubbleText: { fontSize: 13, lineHeight: 20 },
  thinking: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 18, borderBottomLeftRadius: 4, alignSelf: 'flex-start', width: 80, borderWidth: 1 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#94a3b8' },
  quickPrompts: { paddingHorizontal: 12, paddingVertical: 6, maxHeight: 44 },
  qpBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1.5, marginRight: 6 },
  qpBtnText: { fontSize: 11, fontWeight: '600' },
  inputBar: { flexDirection: 'row', gap: 8, padding: 10, paddingHorizontal: 12, borderTopWidth: 1 },
  chatInput: { flex: 1, borderWidth: 1.5, borderRadius: 22, padding: 10, paddingHorizontal: 14, fontSize: 13 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
