import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { EmptyJourney } from '@/components/EmptyJourney';
import { Page } from '@/components/Page';
import { TechniqueCard } from '@/components/TechniqueCard';
import { Card, Pill, ProgressBar, SectionHeading } from '@/components/ui';
import { useJourneyStore } from '@/store/journeyStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { calculateJourneyProgress, techniqueCounts } from '@/utils/learning';

export default function LearningPlanScreen() {
  const router = useRouter();
  const plan = useJourneyStore((state) => state.plan);

  if (!plan) {
    return (
      <Page tabScreen contentStyle={styles.emptyPage}>
        <EmptyJourney />
      </Page>
    );
  }

  const progress = calculateJourneyProgress(plan);
  const counts = techniqueCounts(plan);

  return (
    <Page tabScreen contentStyle={styles.page}>
      <SectionHeading
        eyebrow="Your focused roadmap"
        title={plan.title}
        caption={plan.outcome}
      />

      <Card style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View style={styles.trophyIcon}>
            <Ionicons name="trophy" size={24} color={colors.warning} />
          </View>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryTitle}>{progress}% of the journey resolved</Text>
            <Text style={styles.summaryCaption}>{counts.completed} completed • {counts.skipped} skipped • {counts.total} total</Text>
          </View>
          <Pill>{plan.totalWeeks} weeks</Pill>
        </View>
        <ProgressBar value={progress} />
      </Card>

      <View style={styles.focusNote}>
        <Ionicons name="bulb" size={20} color={colors.primary} />
        <Text style={styles.focusText}>
          Only seven high-leverage techniques. Finish, skip, or ask Nova for a better route.
        </Text>
      </View>

      <View style={styles.list}>
        {plan.techniques.map((technique, index) => (
          <View key={technique.id} style={styles.timelineRow}>
            <View style={styles.timelineRail}>
              {index < plan.techniques.length - 1 ? <View style={styles.railLine} /> : null}
            </View>
            <View style={styles.cardWrap}>
              <TechniqueCard
                technique={technique}
                onPress={() => router.push({ pathname: '/technique/[id]', params: { id: technique.id } })}
              />
            </View>
          </View>
        ))}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.xl },
  emptyPage: { justifyContent: 'center', minHeight: '100%' },
  summaryCard: { gap: spacing.md, padding: spacing.lg },
  summaryTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  trophyIcon: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.warningSoft },
  summaryCopy: { flex: 1, gap: 2 },
  summaryTitle: { ...typography.label, color: colors.ink, fontSize: 14 },
  summaryCaption: { ...typography.caption, color: colors.muted },
  focusNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderRadius: radius.md, padding: spacing.sm, backgroundColor: colors.surfaceAlt },
  focusText: { ...typography.caption, color: colors.inkSoft, flex: 1 },
  list: { gap: spacing.sm },
  timelineRow: { flexDirection: 'row' },
  timelineRail: { width: 0, alignItems: 'center' },
  railLine: { position: 'absolute', top: 62, bottom: -18, width: 2, backgroundColor: colors.primarySoft },
  cardWrap: { flex: 1 },
});
