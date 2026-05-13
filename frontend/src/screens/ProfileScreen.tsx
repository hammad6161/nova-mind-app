import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const DEVS = [
  { name: 'Ali', role: 'Lead Developer · UI/UX', color: '#6366f1', badge: 'Frontend' },
  { name: 'Amine', role: 'AI & Backend Engineer', color: '#8b5cf6', badge: 'AI/ML' },
  { name: 'Adam', role: 'Full-stack & Data', color: '#14b8a6', badge: 'Backend' },
];

export default function ProfileScreen({ navigation }: any) {
  const { colors, isDark, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.hero, { backgroundColor: colors.navy }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'S'}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Student'}</Text>
        <Text style={styles.sub}>Year 3 · STEM · Computer Science</Text>
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.tagText, { color: colors.primary }]}>Free plan</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.secondary + '20' }]}>
            <Text style={[styles.tagText, { color: colors.secondary }]}>🔥 12 day streak</Text>
          </View>
        </View>
      </View>

      <View style={[styles.upgradeCard, { backgroundColor: colors.navy }]}>
        <Text style={styles.upgradeTitle}>✨ Upgrade to Pro</Text>
        <Text style={styles.upgradeSub}>Unlimited AI tutor · Offline access · Advanced analytics · Priority support · Export notes</Text>
        <TouchableOpacity style={[styles.upgradeBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.upgradeBtnText}>Upgrade · $4.99/month</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Settings</Text>
      <View style={[styles.settingsWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingText, { color: colors.text }]}>🌙 Dark mode</Text>
          <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: colors.surface3, true: colors.primary }} />
        </View>
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingText, { color: colors.text }]}>🔔 Notifications</Text>
          <Switch value={true} trackColor={{ false: colors.surface3, true: colors.primary }} />
        </View>
        <TouchableOpacity style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingText, { color: colors.text }]}>⏰ Daily reminder</Text>
          <Text style={[styles.settingValue, { color: colors.textTertiary }]}>9:00 AM ›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingText, { color: colors.text }]}>🌐 Language</Text>
          <Text style={[styles.settingValue, { color: colors.textTertiary }]}>English ›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow} onPress={logout}>
          <Text style={[styles.settingText, { color: '#ef4444' }]}>🚪 Log out</Text>
          <Text style={[styles.settingValue, { color: colors.textTertiary }]}>›</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Development team</Text>
      <View style={[styles.devsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.devsTitle, { color: colors.textTertiary }]}>Built with ❤️ by</Text>
        {DEVS.map((dev, i) => (
          <View key={i} style={[styles.devRow, i > 0 && { borderTopColor: colors.border, borderTopWidth: 1 }]}>
            <View style={[styles.devAvatar, { backgroundColor: dev.color }]}>
              <Text style={styles.devAvatarText}>{dev.name[0]}</Text>
            </View>
            <View style={styles.devInfo}>
              <Text style={[styles.devName, { color: colors.text }]}>{dev.name}</Text>
              <Text style={[styles.devRole, { color: colors.textTertiary }]}>{dev.role}</Text>
            </View>
            <View style={[styles.devBadge, { backgroundColor: dev.color + '15' }]}>
              <Text style={[styles.devBadgeText, { color: dev.color }]}>{dev.badge}</Text>
            </View>
          </View>
        ))}
        <Text style={[styles.version, { color: colors.textTertiary }]}>Nova Mind v2.0 · © 2025 Ali, Amine & Adam</Text>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingTop: 60, paddingBottom: 32, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  name: { color: '#fff', fontSize: 22, fontWeight: '700' },
  sub: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 },
  tags: { flexDirection: 'row', gap: 8, marginTop: 12 },
  tag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  tagText: { fontSize: 12, fontWeight: '700' },
  upgradeCard: { margin: 14, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(99,102,241,0.2)' },
  upgradeTitle: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 8 },
  upgradeSub: { color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  upgradeBtn: { padding: 14, borderRadius: 16, alignItems: 'center' },
  upgradeBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  sectionTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  settingsWrap: { marginHorizontal: 14, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  settingText: { fontSize: 14 },
  settingValue: { fontSize: 13 },
  devsCard: { marginHorizontal: 14, padding: 16, borderRadius: 18, borderWidth: 1 },
  devsTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 },
  devRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  devAvatar: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  devAvatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  devInfo: { flex: 1 },
  devName: { fontSize: 14, fontWeight: '700' },
  devRole: { fontSize: 12, marginTop: 1 },
  devBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  devBadgeText: { fontSize: 11, fontWeight: '700' },
  version: { textAlign: 'center', marginTop: 16, fontSize: 12 },
});
