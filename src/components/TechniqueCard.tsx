import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Technique } from '@/types/learning';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { StatusBadge } from './ui';

export function TechniqueCard({ technique, onPress }: { technique: Technique; onPress: () => void }) {
  const locked = technique.status === 'locked';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: locked }}
      onPress={onPress}
      disabled={locked}
      style={({ pressed }) => [styles.card, shadows.card, locked && styles.locked, pressed && styles.pressed]}
    >
      <View style={[styles.order, technique.status === 'completed' && styles.orderComplete]}>
        {technique.status === 'completed' ? (
          <Ionicons name="checkmark" size={18} color={colors.white} />
        ) : (
          <Text style={styles.orderText}>{technique.order}</Text>
        )}
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>{technique.shortTitle}</Text>
          <StatusBadge status={technique.status} />
        </View>
        <Text style={styles.description} numberOfLines={2}>{technique.description}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={15} color={colors.muted} />
          <Text style={styles.meta}>{technique.minutes} min</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.meta}>{technique.resources.length} resources</Text>
          {technique.replaced ? <Text style={styles.replaced}>Adjusted</Text> : null}
        </View>
      </View>
      {!locked ? <Ionicons name="chevron-forward" size={20} color={colors.muted} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md },
  locked: { opacity: 0.6, backgroundColor: '#F5F4F7' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.995 }] },
  order: { width: 40, height: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  orderComplete: { backgroundColor: colors.success },
  orderText: { ...typography.label, color: colors.primary },
  copy: { flex: 1, gap: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs },
  title: { ...typography.label, fontSize: 15, color: colors.ink, flex: 1 },
  description: { ...typography.caption, color: colors.muted },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  meta: { ...typography.caption, color: colors.muted },
  dot: { color: colors.border },
  replaced: { ...typography.caption, color: colors.primary, fontWeight: '700', marginLeft: spacing.xs },
});
