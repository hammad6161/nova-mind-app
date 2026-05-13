import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Svg, { Path } from 'react-native-svg';

export default function SplashScreen() {
  const { colors } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.navy }]}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
        <View style={styles.logo}>
          <Svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2">
            <Path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <Path d="M2 17l10 5 10-5"/>
            <Path d="M2 12l10 5 10-5"/>
          </Svg>
        </View>
        <Text style={styles.title}>Nova Mind</Text>
        <Text style={styles.subtitle}>Smart Study Planner</Text>
      </Animated.View>
      <Text style={styles.devs}>Developed by Ali · Amine · Adam</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  devs: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
