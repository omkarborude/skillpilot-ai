import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { EmptyJourney } from '@/components/EmptyJourney';
import { Page } from '@/components/Page';
import { RobotMascot } from '@/components/RobotMascot';
import { Button, Card, Pill, ProgressBar, SectionHeading } from '@/components/ui';
import { useJourneyStore } from '@/store/journeyStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { ResourceType } from '@/types/learning';
import { calculateJourneyProgress, getActiveTechnique, techniqueCounts } from '@/utils/learning';

const taskIcon: Record<ResourceType, React.ComponentProps<typeof Ionicons>['name']> = {
  video: 'play-circle',
  audio: 'headset',
  article: 'document-text',
  practice: 'fitness',
};

export default function DashboardScreen() {
  const router = useRouter();
  const plan = useJourneyStore((state) => state.plan);
  const streakDays = useJourneyStore((state) => state.streakDays);
  const xp = useJourneyStore((state) => state.xp);
  const practiceSessions = useJourneyStore((state) => state.practiceSessions);

  if (!plan) {
    return (
      <Page tabScreen contentStyle={styles.emptyPage}>
        <EmptyJourney />
      </Page>
    );
  }

  const progress = calculateJourneyProgress(plan);
  const activeTechnique = getActiveTechnique(plan);
  const counts = techniqueCounts(plan);
  const todayResources = activeTechnique?.resources.slice(0, 3) ?? [];
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const formattedDate = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
  const latestSession = practiceSessions.at(-1);

  return (
    <Page tabScreen contentStyle={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>{formattedDate}</Text>
          <Text style={styles.greeting}>{greeting} 👋</Text>
          <Text style={styles.subheading}>Ready to move one useful step forward?</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>SP</Text></View>
      </View>

      <LinearGradient colors={[colors.night, '#312078']} style={styles.missionCard}>
        <View style={styles.missionTop}>
          <Pill tone="green">TODAY’S MISSION</Pill>
          <RobotMascot size="small" />
        </View>
        <Text style={styles.missionTitle}>{activeTechnique?.shortTitle ?? 'Journey complete'}</Text>
        <Text style={styles.missionCaption}>
          {activeTechnique?.whyItMatters ?? 'You completed every focused technique in this plan.'}
        </Text>
        <View style={styles.missionMeta}>
          <View style={styles.metaPill}>
            <Ionicons name="time" size={16} color={colors.white} />
            <Text style={styles.metaText}>{activeTechnique?.minutes ?? 0} min</Text>
          </View>
          <View style={styles.metaPill}>
            <Ionicons name="flash" size={16} color={colors.warning} />
            <Text style={styles.metaText}>+25 XP</Text>
          </View>
        </View>
        {activeTechnique ? (
          <Button
            label="Continue practice"
            icon="arrow-forward"
            onPress={() => router.push({ pathname: '/practice/[id]', params: { id: activeTechnique.id } })}
          />
        ) : null}
      </LinearGradient>

      <Card style={styles.journeyCard}>
        <View style={styles.journeyTop}>
          <View style={styles.journeyCopy}>
            <Text style={styles.cardEyebrow}>CURRENT JOURNEY</Text>
            <Text style={styles.journeyTitle}>{plan.title}</Text>
            <Text style={styles.journeyOutcome}>{plan.outcome}</Text>
          </View>
          <View style={styles.progressBubble}>
            <Text style={styles.progressNumber}>{progress}%</Text>
          </View>
        </View>
        <ProgressBar value={progress} />
        <View style={styles.journeyStats}>
          <Text style={styles.statCopy}>{counts.completed} completed</Text>
          <Text style={styles.statCopy}>{counts.total - counts.completed - counts.skipped} to explore</Text>
          <Text style={styles.statCopy}>{plan.totalWeeks} week path</Text>
        </View>
      </Card>

      <SectionHeading
        title="Today’s focused plan"
        caption="The right medium for each part—not a random playlist."
      />
      <Card style={styles.planCard}>
        {todayResources.map((resource, index) => (
          <View key={resource.id} style={[styles.taskRow, index > 0 && styles.taskDivider]}>
            <View style={[styles.taskIcon, { backgroundColor: index === 0 ? colors.primarySoft : colors.surfaceAlt }]}>
              <Ionicons name={taskIcon[resource.type]} size={21} color={colors.primary} />
            </View>
            <View style={styles.taskCopy}>
              <Text style={styles.taskType}>{resource.type}</Text>
              <Text style={styles.taskTitle}>{resource.title}</Text>
            </View>
            <Text style={styles.taskDuration}>{resource.durationLabel}</Text>
          </View>
        ))}
        {activeTechnique ? (
          <Button
            label="View technique"
            variant="secondary"
            onPress={() => router.push({ pathname: '/technique/[id]', params: { id: activeTechnique.id } })}
          />
        ) : null}
      </Card>

      <View style={styles.quickStats}>
        <Card style={styles.quickStatCard}>
          <View style={[styles.quickIcon, { backgroundColor: colors.warningSoft }]}>
            <Text style={styles.quickEmoji}>🔥</Text>
          </View>
          <Text style={styles.quickValue}>{streakDays}</Text>
          <Text style={styles.quickLabel}>day streak</Text>
        </Card>
        <Card style={styles.quickStatCard}>
          <View style={[styles.quickIcon, { backgroundColor: colors.primarySoft }]}>
            <Text style={styles.quickEmoji}>⭐</Text>
          </View>
          <Text style={styles.quickValue}>{xp}</Text>
          <Text style={styles.quickLabel}>XP earned</Text>
        </Card>
      </View>

      <Card style={styles.insightCard}>
        <RobotMascot size="small" />
        <View style={styles.insightCopy}>
          <Text style={styles.insightEyebrow}>NOVA’S NOTE</Text>
          <Text style={styles.insightText}>
            {latestSession
              ? `Your latest session added ${latestSession.minutes} focused minute${latestSession.minutes === 1 ? '' : 's'}. Continue when you are ready.`
              : 'Complete your first practice session to start building a personal activity history.'}
          </Text>
        </View>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.xl },
  emptyPage: { justifyContent: 'center', minHeight: '100%' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  eyebrow: { ...typography.caption, color: colors.primary, fontWeight: '700', letterSpacing: 0.5 },
  greeting: { ...typography.title, color: colors.ink, marginTop: 2 },
  subheading: { ...typography.body, color: colors.muted, marginTop: 2 },
  avatar: { width: 46, height: 46, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft, borderWidth: 2, borderColor: colors.surface },
  avatarText: { ...typography.label, color: colors.primaryDark },
  missionCard: { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md, overflow: 'hidden' },
  missionTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  missionTitle: { ...typography.title, color: colors.white },
  missionCaption: { ...typography.body, color: '#D3CCE9' },
  missionMeta: { flexDirection: 'row', gap: spacing.xs },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.pill },
  metaText: { ...typography.caption, color: colors.white, fontWeight: '700' },
  journeyCard: { gap: spacing.md, padding: spacing.lg },
  journeyTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  journeyCopy: { flex: 1, gap: 3 },
  cardEyebrow: { ...typography.caption, color: colors.primary, fontWeight: '700', letterSpacing: 0.5 },
  journeyTitle: { ...typography.heading, color: colors.ink },
  journeyOutcome: { ...typography.caption, color: colors.muted },
  progressBubble: { width: 66, height: 66, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt, borderWidth: 5, borderColor: colors.primarySoft },
  progressNumber: { ...typography.heading, color: colors.primary, fontSize: 18 },
  journeyStats: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.xs, flexWrap: 'wrap' },
  statCopy: { ...typography.caption, color: colors.muted },
  planCard: { gap: spacing.sm },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  taskDivider: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  taskIcon: { width: 42, height: 42, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  taskCopy: { flex: 1, gap: 1 },
  taskType: { ...typography.caption, color: colors.primary, textTransform: 'uppercase', fontWeight: '700' },
  taskTitle: { ...typography.label, color: colors.ink },
  taskDuration: { ...typography.caption, color: colors.muted },
  quickStats: { flexDirection: 'row', gap: spacing.sm },
  quickStatCard: { flex: 1, alignItems: 'center', gap: 3 },
  quickIcon: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  quickEmoji: { fontSize: 20 },
  quickValue: { ...typography.heading, color: colors.ink },
  quickLabel: { ...typography.caption, color: colors.muted },
  insightCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surfaceAlt },
  insightCopy: { flex: 1, gap: 3 },
  insightEyebrow: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  insightText: { ...typography.body, color: colors.inkSoft },
});
