import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LearningResource, ResourceType } from '@/types/learning';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { resolveResourceDestination } from '@/utils/resources';

const resourceIcon: Record<ResourceType, React.ComponentProps<typeof Ionicons>['name']> = {
  video: 'play-circle',
  audio: 'headset',
  article: 'document-text',
  practice: 'fitness',
};

const resourceColor: Record<ResourceType, string> = {
  video: colors.coral,
  audio: colors.primary,
  article: colors.cyan,
  practice: colors.success,
};

export function ResourceCard({ resource, onPress }: { resource: LearningResource; onPress?: () => void }) {
  const destination = resolveResourceDestination(resource);
  const unavailable = destination.kind === 'unavailable';
  const title = resource.type === 'practice'
    ? 'Guided practice'
    : unavailable
      ? 'Search unavailable'
      : resource.searchQuery;
  const actionLabel = destination.kind === 'search' ? destination.actionLabel : 'Open in SkillPilot';

  return (
    <Pressable
      accessibilityRole={unavailable ? undefined : 'button'}
      accessibilityState={{ disabled: unavailable }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [styles.card, unavailable && styles.unavailable, pressed && styles.pressed]}
    >
      <View style={[styles.icon, { backgroundColor: `${resourceColor[resource.type]}18` }]}>
        <Ionicons name={resourceIcon[resource.type]} size={22} color={resourceColor[resource.type]} />
      </View>
      <View style={styles.copy}>
        <View style={styles.topRow}>
          <Text style={styles.type}>{resource.type === 'practice' ? 'Practice' : `Suggested ${resource.type} search`}</Text>
          {!unavailable ? <Text style={styles.action}>{actionLabel}</Text> : null}
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {unavailable ? 'This recommendation does not include a usable search query.' : resource.description}
        </Text>
      </View>
      <Ionicons name={unavailable ? 'alert-circle-outline' : 'chevron-forward'} color={colors.muted} size={19} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.sm, backgroundColor: colors.surface },
  pressed: { opacity: 0.76 },
  unavailable: { opacity: 0.68 },
  icon: { width: 46, height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 3 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  type: { ...typography.caption, textTransform: 'uppercase', color: colors.primary, fontWeight: '700', letterSpacing: 0.4 },
  action: { ...typography.caption, color: colors.muted },
  title: { ...typography.label, color: colors.ink, fontSize: 14 },
  description: { ...typography.caption, color: colors.muted },
});
