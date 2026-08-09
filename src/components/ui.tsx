import type { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, spacing } from '../app/theme';
import type { ScreenName, TechniqueStatus } from '../types/learning';

const tabs: Array<{ screen: ScreenName; label: string }> = [
  { screen: 'dashboard', label: 'Home' },
  { screen: 'plan', label: 'Plan' },
  { screen: 'coach', label: 'AI' },
  { screen: 'progress', label: 'Progress' },
  { screen: 'profile', label: 'Profile' },
];

export function ScreenStack({ children }: PropsWithChildren) {
  return <View style={styles.stack}>{children}</View>;
}

export function Card({ children, title, subtitle }: PropsWithChildren<{ title?: string; subtitle?: string }>) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

export function Hero({ eyebrow, title, body, children }: PropsWithChildren<{ eyebrow: string; title: string; body: string }>) {
  return (
    <View style={styles.hero}>
      <Text style={styles.heroEyebrow}>{eyebrow}</Text>
      <Text style={styles.heroTitleLight}>{title}</Text>
      <Text style={styles.heroBody}>{body}</Text>
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

export function Field({ label, value, onChangeText, multiline = false }: { label: string; value: string; onChangeText: (value: string) => void; multiline?: boolean }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} multiline={multiline} style={[styles.input, multiline && styles.textArea]} />
    </View>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return <View accessibilityLabel={`Progress ${value}%`} style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%` }]} /></View>;
}

export function Metric({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return <Card><Text style={[styles.metricValue, small && styles.metricSmall]}>{value}</Text><Text style={styles.muted}>{label}</Text></Card>;
}

export function ResourceItem({ title, meta }: { title: string; meta: string }) {
  return <View style={styles.resource}><Text style={styles.cardHeadline}>{title}</Text><Text style={styles.muted}>{meta}</Text></View>;
}

export function ChecklistItem({ label }: { label: string }) {
  return <Text style={styles.checklist}>✓ {label}</Text>;
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.infoRow}><Text style={styles.muted}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

export function StatusDot({ status, label }: { status: TechniqueStatus; label: string | number }) {
  return <Text style={[styles.statusDot, statusStyle(status)]}>{label}</Text>;
}

export function ConfirmSheet({ visible, title, body, onClose, onConfirm }: { visible: boolean; title: string; body: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <Text style={styles.cardHeadline}>{title}</Text>
          <Text style={styles.muted}>{body}</Text>
          <View style={styles.choiceRow}>
            <PrimaryButton muted label="Cancel" onPress={onClose} />
            <PrimaryButton label="Confirm" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function BottomTabs({ current, onSelect }: { current: ScreenName; onSelect: (screen: ScreenName) => void }) {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => (
        <Pressable key={tab.screen} accessibilityRole="tab" accessibilityState={{ selected: current === tab.screen }} style={[styles.tab, current === tab.screen && styles.tabActive]} onPress={() => onSelect(tab.screen)}>
          <Text style={[styles.tabText, current === tab.screen && styles.tabTextActive]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function statusStyle(status: TechniqueStatus) {
  if (status === 'completed') return styles.status_completed;
  if (status === 'skipped') return styles.status_skipped;
  if (status === 'locked') return styles.status_locked;
  return styles.status_available;
}

export const styles = StyleSheet.create({
  stack: { gap: spacing.md },
  card: { padding: spacing.lg, borderRadius: radii.xl, backgroundColor: colors.surface, shadowColor: '#111827', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 4, gap: spacing.sm },
  cardTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  cardSubtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  hero: { gap: spacing.sm, padding: spacing.xl, borderRadius: 32, backgroundColor: colors.ink },
  heroEyebrow: { color: '#C8C2FF', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.2 },
  heroTitleLight: { color: '#FFFFFF', fontSize: 38, lineHeight: 40, fontWeight: '900', letterSpacing: -1.8 },
  heroBody: { color: '#DAD7FF', fontSize: 15, lineHeight: 23 },
  heroMeta: { color: '#FFFFFF', fontWeight: '800' },
  button: { minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: colors.primary, paddingHorizontal: spacing.lg },
  buttonMuted: { backgroundColor: '#F0EEFF' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  buttonMutedText: { color: colors.primary },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  pill: { minHeight: 44, justifyContent: 'center', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: spacing.md, backgroundColor: '#FFFFFF' },
  pillSelected: { borderColor: colors.primary, backgroundColor: '#F0EEFF' },
  pillText: { color: colors.text, fontWeight: '700', textAlign: 'center', textTransform: 'capitalize' },
  pillTextSelected: { color: colors.primary },
  label: { color: colors.text, fontWeight: '800', marginBottom: spacing.xs },
  input: { minHeight: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: radii.md, paddingHorizontal: spacing.md, color: colors.text, backgroundColor: '#FFFFFF' },
  textArea: { minHeight: 104, paddingTop: spacing.md, textAlignVertical: 'top' },
  progressTrack: { height: 9, overflow: 'hidden', borderRadius: 99, backgroundColor: '#E7E8F0' },
  progressFill: { height: '100%', borderRadius: 99, backgroundColor: colors.primary },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' },
  cardHeadline: { color: colors.text, fontSize: 17, fontWeight: '900' },
  muted: { color: colors.muted, lineHeight: 21 },
  metricValue: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: -1.4 },
  metricSmall: { fontSize: 17, letterSpacing: -0.3 },
  resource: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#EEF0F6' },
  checklist: { color: colors.text, fontSize: 16, paddingVertical: spacing.xs },
  statusDot: { width: 34, height: 34, overflow: 'hidden', borderRadius: 17, color: '#FFFFFF', textAlign: 'center', lineHeight: 34, fontWeight: '900', backgroundColor: colors.primary },
  status_completed: { backgroundColor: colors.success },
  status_available: { backgroundColor: colors.primary },
  status_locked: { backgroundColor: '#A8AAB8' },
  status_skipped: { backgroundColor: colors.warning },
  statusText: { color: colors.primary, fontWeight: '800', textTransform: 'capitalize' },
  infoRow: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#EEF0F6' },
  infoValue: { color: colors.text, fontWeight: '800', marginTop: 3 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(17,24,39,0.35)' },
  modalSheet: { gap: spacing.md, padding: spacing.lg, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.surface },
  tabs: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.md, flexDirection: 'row', gap: spacing.xs, padding: spacing.xs, borderRadius: 24, backgroundColor: '#FFFFFF', shadowColor: '#111827', shadowOpacity: 0.14, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  tab: { flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  tabActive: { backgroundColor: '#F0EEFF' },
  tabText: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  tabTextActive: { color: colors.primary },
});
