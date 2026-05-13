import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'brain',
    title: 'Welcome to Nova Mind',
    desc: 'Your AI-powered personal study planner. Smarter scheduling, spaced repetition, and an AI tutor — all in one app.',
    color: '#6366f1',
  },
  {
    icon: 'calendar',
    title: 'AI-Powered Scheduling',
    desc: 'Add courses and exams. Our AI automatically builds your optimal weekly study plan and tracks your progress in real time.',
    color: '#8b5cf6',
  },
  {
    icon: 'chat',
    title: 'AI Tutor, 24/7',
    desc: 'Ask anything, anytime. Get instant explanations, practice questions, quizzes and chapter summaries powered by AI.',
    color: '#14b8a6',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  const handleStart = async () => {
    try {
      await register(name, email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      navigation.navigate('Login');
    }
  };

  if (step >= slides.length) {
    return (
      <View style={[styles.container, { backgroundColor: colors.navy }]}>
        <Animated.View entering={FadeInUp.duration(500)} style={styles.formContainer}>
          <Text style={styles.formTitle}>Let's get you set up!</Text>
          <Text style={styles.formSubtitle}>Create your account to start studying smarter.</Text>

          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Your name"
            placeholderTextColor={colors.textTertiary}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Email"
            placeholderTextColor={colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Password"
            placeholderTextColor={colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleStart}>
            <Text style={styles.buttonText}>Start studying →</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.linkText, { color: colors.primary }]}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  const slide = slides[step];

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      <Animated.View entering={FadeInRight.duration(400)} style={styles.slide}>
        <View style={[styles.iconContainer, { backgroundColor: slide.color + '20', borderColor: slide.color + '40' }]}>
          <Svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={slide.color} strokeWidth="2">
            {slide.icon === 'brain' && (
              <>
                <Path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <Path d="M2 17l10 5 10-5"/>
                <Path d="M2 12l10 5 10-5"/>
              </>
            )}
            {slide.icon === 'calendar' && (
              <>
                <Path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
                <Path d="M12 6v6l4 2"/>
              </>
            )}
            {slide.icon === 'chat' && (
              <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            )}
          </Svg>
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>
      </Animated.View>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleNext}>
        <Text style={styles.buttonText}>{step === slides.length - 1 ? 'Get started →' : 'Next →'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  desc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 40,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#6366f1',
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  formContainer: {
    width: '100%',
    maxWidth: 360,
  },
  formTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  formSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 12,
    fontSize: 15,
  },
  linkText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});
