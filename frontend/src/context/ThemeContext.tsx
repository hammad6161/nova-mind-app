import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightTheme = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryLight: '#e0e7ff',
  secondary: '#14b8a6',
  accent: '#f59e0b',
  danger: '#ef4444',
  success: '#22c55e',
  background: '#f8fafc',
  surface: '#ffffff',
  surface2: '#f1f5f9',
  surface3: '#e2e8f0',
  text: '#0f172a',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  border: '#e2e8f0',
  navy: '#0f172a',
  shadow: 'rgba(15, 23, 42, 0.08)',
};

export const darkTheme = {
  primary: '#818cf8',
  primaryDark: '#6366f1',
  primaryLight: 'rgba(99, 102, 241, 0.15)',
  secondary: '#2dd4bf',
  accent: '#fbbf24',
  danger: '#f87171',
  success: '#4ade80',
  background: '#0f172a',
  surface: '#1e293b',
  surface2: '#334155',
  surface3: '#475569',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textTertiary: '#64748b',
  border: '#334155',
  navy: '#0f172a',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colors: typeof lightTheme;
  theme: ThemeType;
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: lightTheme,
  theme: 'system',
  isDark: false,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');

  useEffect(() => {
    AsyncStorage.getItem('theme').then((saved) => {
      if (saved) setThemeState(saved as ThemeType);
    });
  }, []);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const isDark = theme === 'system' 
    ? systemColorScheme === 'dark' 
    : theme === 'dark';

  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ colors, theme, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
