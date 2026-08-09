import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../app/theme';

export function Card({ children, title, subtitle }: PropsWithChildren<{ title?: string; subtitle?: string }>) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

export function PrimaryButton({ label, onPress, muted = false }: { label: string; onPress: () => void; muted?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.button, muted && styles.buttonMuted, pressed && styles.pressed]}>
      <Text style={[styles.buttonText, muted && styles.buttonMutedText]}>{label}</Text>
    </Pressable>
  );
}

export function Pill({ label, selected = false, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole={onPress ? 'button' : undefined} onPress={onPress} style={[styles.pill, selected && styles.pillSelected]}>
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return <View accessibilityLabel={`Progress ${value}%`} style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%` }]} /></View>;
}

export const styles = StyleSheet.create({
  card: { padding: spacing.lg, borderRadius: radii.xl, backgroundColor: colors.surface, shadowColor: '#111827', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 4, gap: spacing.sm },
  cardTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  cardSubtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  button: { minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: colors.primary, paddingHorizontal: spacing.lg },
  buttonMuted: { backgroundColor: '#F0EEFF' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  buttonMutedText: { color: colors.primary },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  pill: { minHeight: 44, justifyContent: 'center', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: spacing.md, backgroundColor: '#FFFFFF' },
  pillSelected: { borderColor: colors.primary, backgroundColor: '#F0EEFF' },
  pillText: { color: colors.text, fontWeight: '700', textAlign: 'center', textTransform: 'capitalize' },
  pillTextSelected: { color: colors.primary },
  progressTrack: { height: 9, overflow: 'hidden', borderRadius: 99, backgroundColor: '#E7E8F0' },
  progressFill: { height: '100%', borderRadius: 99, backgroundColor: colors.primary },
});
