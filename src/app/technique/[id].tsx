import { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActionSheet } from '@/components/ActionSheet';
import { Page } from '@/components/Page';
import { ResourceCard } from '@/components/ResourceCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button, Card, Pill, StatusBadge } from '@/components/ui';
import { aiProvider } from '@/services/aiProvider';
import { useJourneyStore } from '@/store/journeyStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { LearningResource, ReplacementMode } from '@/types/learning';
import { resolveResourceDestination } from '@/utils/resources';

const replacementOptions: {
  id: ReplacementMode;
  title: string;
  caption: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}[] = [
  { id: 'simpler', title: 'Simpler foundation', caption: 'Reduce difficulty and rebuild the core motion.', icon: 'leaf' },
  { id: 'shorter', title: 'Shorter version', caption: 'Keep only the highest-impact eight minutes.', icon: 'timer' },
  { id: 'different', title: 'Different approach', caption: 'Reach the same outcome with a new explanation.', icon: 'shuffle' },
];

export default function TechniqueDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const plan = useJourneyStore((state) => state.plan);
  const goal = useJourneyStore((state) => state.goal);
  const applyReplacement = useJourneyStore((state) => state.applyTechniqueReplacement);
  const setStatus = useJourneyStore((state) => state.setTechniqueStatus);
  const [tab, setTab] = useState<'overview' | 'resources'>('overview');
  const [replaceVisible, setReplaceVisible] = useState(false);
  const [skipVisible, setSkipVisible] = useState(false);
  const [replacing, setReplacing] = useState<ReplacementMode | null>(null);
  const [replaceError, setReplaceError] = useState('');
  const [resourceError, setResourceError] = useState('');

  const technique = useMemo(
    () => plan?.techniques.find((item) => item.id === id),
    [id, plan],
  );

  if (!technique) {
    return (
      <Page contentStyle={styles.missing}>
        <Text style={styles.missingTitle}>Technique not found</Text>
        <Text style={styles.missingCaption}>The plan may have changed or been reset.</Text>
        <Button label="Back to learning plan" onPress={() => router.replace('/(tabs)/plan')} />
      </Page>
    );
  }

  const featuredResource = technique.resources[0];

  const replace = async (mode: ReplacementMode) => {
    if (!goal) return;
    setReplacing(mode);
    setReplaceError('');
    try {
      const replacement = await aiProvider.replaceTechnique(technique, mode, goal);
      applyReplacement(replacement);
      setReplaceVisible(false);
    } catch {
      setReplaceError('This technique could not be adjusted. Your current plan is unchanged; please retry.');
    } finally {
      setReplacing(null);
    }
  };

  const skip = () => {
    setStatus(technique.id, 'skipped');
    setSkipVisible(false);
    router.replace('/(tabs)/plan');
  };

  const openResource = async (resource: LearningResource) => {
    setResourceError('');
    const destination = resolveResourceDestination(resource);

    if (destination.kind === 'practice') {
      router.push({ pathname: '/practice/[id]', params: { id: technique.id } });
      return;
    }

    if (destination.kind === 'unavailable') {
      setResourceError('No search query is available for this recommendation. Try replacing the technique.');
      return;
    }

    try {
      await Linking.openURL(destination.url);
    } catch {
      setResourceError('This resource could not be opened. Check your connection and try again.');
    }
  };

  return (
    <Page contentStyle={styles.page}>
      <ScreenHeader title={`Technique ${technique.order}`} caption={plan?.title} />

      <View style={styles.titleBlock}>
        <View style={styles.titleMeta}>
          <StatusBadge status={technique.status} />
          <Pill tone="neutral">{technique.minutes} min</Pill>
          {technique.replaced ? <Pill>Adjusted</Pill> : null}
        </View>
        <Text style={styles.title}>{technique.title}</Text>
        <Text style={styles.description}>{technique.description}</Text>
      </View>

      {featuredResource ? (
        <LinearGradient colors={[colors.night, '#3C238B']} style={styles.featured}>
          <View style={styles.featuredDecorOne} />
          <View style={styles.featuredDecorTwo} />
          <View style={styles.featuredTop}>
            <Pill tone="green">
              {featuredResource.type === 'practice'
                ? 'GUIDED PRACTICE'
                : `SUGGESTED ${featuredResource.type.toUpperCase()} SEARCH`}
            </Pill>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={featuredResource.type === 'practice' ? 'Open guided practice' : 'Open suggested search'}
            onPress={() => void openResource(featuredResource)}
            style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}
          >
            <Ionicons name={featuredResource.type === 'practice' ? 'play' : 'search'} size={27} color={colors.white} />
          </Pressable>
          <View>
            <Text style={styles.featuredTitle}>
              {featuredResource.type === 'practice' ? 'Practice this technique' : featuredResource.searchQuery}
            </Text>
            <Text style={styles.featuredCaption}>{featuredResource.description}</Text>
          </View>
        </LinearGradient>
      ) : null}

      {resourceError ? <Text style={styles.resourceError}>{resourceError}</Text> : null}

      <View style={styles.tabs}>
        {(['overview', 'resources'] as const).map((item) => (
          <Pressable
            key={item}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === item }}
            onPress={() => setTab(item)}
            style={[styles.tab, tab === item && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 'overview' ? (
        <View style={styles.sectionStack}>
          <Card style={styles.whyCard}>
            <View style={styles.whyIcon}>
              <Ionicons name="sparkles" size={22} color={colors.primary} />
            </View>
            <View style={styles.whyCopy}>
              <Text style={styles.sectionTitle}>Why this matters</Text>
              <Text style={styles.body}>{technique.whyItMatters}</Text>
            </View>
          </Card>
          <Card style={styles.pointsCard}>
            <Text style={styles.sectionTitle}>Three cues to remember</Text>
            {technique.keyPoints.map((point, index) => (
              <View key={point} style={styles.pointRow}>
                <View style={styles.pointNumber}><Text style={styles.pointNumberText}>{index + 1}</Text></View>
                <Text style={styles.pointText}>{point}</Text>
              </View>
            ))}
          </Card>
        </View>
      ) : (
        <View style={styles.sectionStack}>
          {technique.resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onPress={() => void openResource(resource)} />
          ))}
        </View>
      )}

      {technique.status !== 'locked' && technique.status !== 'skipped' ? (
        <View style={styles.primaryActions}>
          <Button
            label={technique.status === 'completed' ? 'Practice again' : 'Start practice'}
            icon="play"
            onPress={() => router.push({ pathname: '/practice/[id]', params: { id: technique.id } })}
          />
          {technique.status === 'in_progress' ? (
            <Button label="Mark as complete" variant="secondary" icon="checkmark" onPress={() => setStatus(technique.id, 'completed')} />
          ) : null}
        </View>
      ) : null}

      {technique.status === 'in_progress' ? (
        <View style={styles.adaptSection}>
          <Text style={styles.adaptTitle}>Not the right fit?</Text>
          <Text style={styles.adaptCaption}>Adapt the plan without losing your overall progress.</Text>
          <View style={styles.adaptActions}>
            <Button label="Ask Nova to replace it" variant="ghost" icon="sparkles" onPress={() => setReplaceVisible(true)} style={styles.flexButton} />
            <Button label="Skip technique" variant="ghost" icon="play-skip-forward" onPress={() => setSkipVisible(true)} style={styles.flexButton} />
          </View>
        </View>
      ) : null}

      <ActionSheet
        visible={replaceVisible}
        onClose={() => setReplaceVisible(false)}
        title="What should Nova change?"
        caption="The outcome stays the same; only the route changes."
      >
        {replaceError ? <Text style={styles.replaceError}>{replaceError}</Text> : null}
        <View style={styles.sheetList}>
          {replacementOptions.map((option) => (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              disabled={Boolean(replacing)}
              onPress={() => void replace(option.id)}
              style={({ pressed }) => [styles.replaceOption, pressed && styles.pressed]}
            >
              <View style={styles.replaceIcon}>
                <Ionicons name={option.icon} size={21} color={colors.primary} />
              </View>
              <View style={styles.replaceCopy}>
                <Text style={styles.replaceTitle}>{option.title}</Text>
                <Text style={styles.replaceCaption}>{option.caption}</Text>
              </View>
              {replacing === option.id ? (
                <Text style={styles.replacingText}>Adjusting…</Text>
              ) : (
                <Ionicons name="chevron-forward" size={19} color={colors.muted} />
              )}
            </Pressable>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet
        visible={skipVisible}
        onClose={() => setSkipVisible(false)}
        title="Skip this technique?"
        caption="It will remain visible as skipped, and the next technique will unlock."
      >
        <View style={styles.sheetList}>
          <Button label="Keep learning this" variant="secondary" onPress={() => setSkipVisible(false)} />
          <Button label="Skip and unlock next" variant="danger" onPress={skip} />
        </View>
      </ActionSheet>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.xl },
  missing: { minHeight: '100%', alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  missingTitle: { ...typography.title, color: colors.ink },
  missingCaption: { ...typography.body, color: colors.muted, textAlign: 'center' },
  titleBlock: { gap: spacing.xs },
  titleMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs },
  title: { ...typography.title, color: colors.ink },
  description: { ...typography.body, color: colors.muted },
  featured: { minHeight: 280, borderRadius: radius.xl, padding: spacing.xl, justifyContent: 'space-between', overflow: 'hidden' },
  featuredTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  featuredDuration: { ...typography.label, color: colors.white },
  playButton: { alignSelf: 'center', width: 68, height: 68, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.32)' },
  featuredTitle: { ...typography.heading, color: colors.white },
  featuredCaption: { ...typography.caption, color: '#D7D0EC', marginTop: 3 },
  featuredDecorOne: { position: 'absolute', width: 160, height: 160, borderRadius: radius.pill, right: -55, top: -70, backgroundColor: 'rgba(120,90,255,0.22)' },
  featuredDecorTwo: { position: 'absolute', width: 110, height: 110, borderRadius: radius.pill, left: -35, bottom: -40, backgroundColor: 'rgba(33,200,195,0.12)' },
  resourceError: { ...typography.caption, color: colors.danger, padding: spacing.sm, backgroundColor: colors.dangerSoft, borderRadius: radius.md },
  tabs: { flexDirection: 'row', borderRadius: radius.md, padding: 4, backgroundColor: colors.surfaceAlt },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.sm },
  tabActive: { backgroundColor: colors.surface },
  tabText: { ...typography.label, color: colors.muted, textTransform: 'capitalize' },
  tabTextActive: { color: colors.primary },
  sectionStack: { gap: spacing.sm },
  whyCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.surfaceAlt },
  whyIcon: { width: 42, height: 42, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  whyCopy: { flex: 1, gap: 3 },
  sectionTitle: { ...typography.label, color: colors.ink, fontSize: 15 },
  body: { ...typography.body, color: colors.inkSoft },
  pointsCard: { gap: spacing.md },
  pointRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pointNumber: { width: 28, height: 28, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  pointNumberText: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  pointText: { ...typography.body, color: colors.inkSoft, flex: 1 },
  primaryActions: { gap: spacing.sm },
  adaptSection: { gap: spacing.xs, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  adaptTitle: { ...typography.heading, color: colors.ink },
  adaptCaption: { ...typography.body, color: colors.muted },
  adaptActions: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xs },
  flexButton: { flex: 1 },
  sheetList: { gap: spacing.sm },
  replaceOption: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.sm },
  replaceIcon: { width: 42, height: 42, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  replaceCopy: { flex: 1, gap: 2 },
  replaceTitle: { ...typography.label, color: colors.ink },
  replaceCaption: { ...typography.caption, color: colors.muted },
  replacingText: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  replaceError: { ...typography.caption, color: colors.danger, padding: spacing.sm, backgroundColor: colors.dangerSoft, borderRadius: radius.md },
  pressed: { opacity: 0.75 },
});
