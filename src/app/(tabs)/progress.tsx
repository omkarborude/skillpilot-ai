import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { EmptyJourney } from '@/components/EmptyJourney';
import { Page } from '@/components/Page';
import { Card, Pill, ProgressBar, SectionHeading } from '@/components/ui';
import { useJourneyStore } from '@/store/journeyStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { Achievement, PracticeSession } from '@/types/learning';
import { calculateJourneyProgress, calculateMasteryProgress, techniqueCounts } from '@/utils/learning';

function recentWeek(sessions: PracticeSession[]) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return {
      label: date.toLocaleDateString(undefined, { weekday: 'narrow' }),
      minutes: sessions
        .filter(({ completedAt }) => completedAt >= date.getTime() && completedAt < nextDate.getTime())
        .reduce((total, { minutes }) => total + minutes, 0),
    };
  });
}

export default function ProgressScreen() {
  const plan = useJourneyStore((state) => state.plan);
  const practiceMinutes = useJourneyStore((state) => state.practiceMinutes);
  const streakDays = useJourneyStore((state) => state.streakDays);
  const practiceSessions = useJourneyStore((state) => state.practiceSessions);

  if (!plan) {
    return (
      <Page tabScreen contentStyle={styles.emptyPage}>
        <EmptyJourney />
      </Page>
    );
  }

  const journeyProgress = calculateJourneyProgress(plan);
  const masteryProgress = calculateMasteryProgress(plan);
  const counts = techniqueCounts(plan);
  const week = recentWeek(practiceSessions);
  const activeDays = week.filter(({ minutes }) => minutes > 0).length;
  const averageSessionMinutes = practiceSessions.length
    ? Math.round(practiceMinutes / practiceSessions.length)
    : 0;
  const achievements: Achievement[] = [
    { id: 'streak', title: '7-day streak', icon: '🔥', unlocked: streakDays >= 7 },
    { id: 'first', title: 'First technique', icon: '🎯', unlocked: counts.completed >= 1 },
    { id: 'consistent', title: 'Consistent learner', icon: '⚡', unlocked: practiceMinutes >= 180 },
    { id: 'halfway', title: 'Halfway there', icon: '🏔️', unlocked: journeyProgress >= 50 },
  ];

  return (
    <Page tabScreen contentStyle={styles.page}>
      <SectionHeading
        eyebrow="Weekly insight"
        title="Your progress"
        caption="Completion, deliberate skips, and practice consistency are shown separately."
      />

      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroEyebrow}>YOUR JOURNEY</Text>
            <Text style={styles.heroTitle}>{plan.title}</Text>
          </View>
          <Pill tone="green">{activeDays} active {activeDays === 1 ? 'day' : 'days'}</Pill>
        </View>
        <View style={styles.heroProgressRow}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressValue}>{journeyProgress}%</Text>
            <Text style={styles.progressLabel}>progress</Text>
          </View>
          <View style={styles.heroStats}>
            <Text style={styles.heroStatValue}>{counts.completed} / {counts.total}</Text>
            <Text style={styles.heroStatLabel}>techniques completed</Text>
            <ProgressBar value={masteryProgress} dark />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Ionicons name="time" size={22} color={colors.primary} />
          <Text style={styles.statValue}>{Math.floor(practiceMinutes / 60)}h {practiceMinutes % 60}m</Text>
          <Text style={styles.statLabel}>practice time</Text>
        </Card>
        <Card style={styles.statCard}>
          <Ionicons name="checkmark-done" size={22} color={colors.success} />
          <Text style={styles.statValue}>{counts.completed}</Text>
          <Text style={styles.statLabel}>completed</Text>
        </Card>
        <Card style={styles.statCard}>
          <Ionicons name="play-skip-forward" size={22} color={colors.warning} />
          <Text style={styles.statValue}>{counts.skipped}</Text>
          <Text style={styles.statLabel}>skipped</Text>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>Practice rhythm</Text>
            <Text style={styles.chartCaption}>Minutes per day</Text>
          </View>
          <Pill tone="neutral">This week</Pill>
        </View>
        <View style={styles.chart}>
          {week.map((day, index) => (
            <View key={`${day.label}-${index}`} style={styles.barColumn}>
              <Text style={styles.barValue}>{day.minutes}</Text>
              <View style={styles.barTrack}>
                <LinearGradient
                  colors={[colors.primarySoft, colors.primary]}
                  style={[styles.bar, { height: day.minutes === 0 ? 0 : Math.max(18, Math.min(96, day.minutes * 3)) }]}
                />
              </View>
              <Text style={styles.dayLabel}>{day.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <SectionHeading title="Achievements" caption="Small rewards for behaviors that actually help learning." />
      <View style={styles.achievementGrid}>
        {achievements.map((achievement) => (
          <Card key={achievement.id} style={[styles.achievement, !achievement.unlocked && styles.locked]}>
            <View style={[styles.achievementIcon, achievement.unlocked && styles.achievementIconUnlocked]}>
              <Text style={styles.achievementEmoji}>{achievement.unlocked ? achievement.icon : '🔒'}</Text>
            </View>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementState}>{achievement.unlocked ? 'Unlocked' : 'Keep going'}</Text>
          </Card>
        ))}
      </View>

      <Card style={styles.insight}>
        <View style={styles.insightIcon}>
          <Ionicons name="sparkles" size={22} color={colors.primary} />
        </View>
        <View style={styles.insightCopy}>
          <Text style={styles.insightTitle}>Your practice pattern</Text>
          <Text style={styles.insightText}>
            {practiceSessions.length
              ? `Your ${practiceSessions.length} recorded session${practiceSessions.length === 1 ? '' : 's'} average ${averageSessionMinutes} minute${averageSessionMinutes === 1 ? '' : 's'}.`
              : 'Complete a practice session to see patterns based on your real activity.'}
          </Text>
        </View>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.xl },
  emptyPage: { justifyContent: 'center', minHeight: '100%' },
  hero: { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.xl },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  heroEyebrow: { ...typography.caption, color: '#CFC7EA', fontWeight: '700' },
  heroTitle: { ...typography.heading, color: colors.white, marginTop: 2 },
  heroProgressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  progressCircle: { width: 96, height: 96, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 8, borderColor: colors.cyan },
  progressValue: { ...typography.title, color: colors.white, fontSize: 24 },
  progressLabel: { ...typography.caption, color: '#D8D2EA' },
  heroStats: { flex: 1, gap: spacing.xs },
  heroStatValue: { ...typography.heading, color: colors.white },
  heroStatLabel: { ...typography.caption, color: '#D8D2EA' },
  statsRow: { flexDirection: 'row', gap: spacing.xs },
  statCard: { flex: 1, gap: 3, padding: spacing.sm },
  statValue: { ...typography.label, color: colors.ink, fontSize: 15, marginTop: 4 },
  statLabel: { ...typography.caption, color: colors.muted },
  chartCard: { gap: spacing.lg, padding: spacing.lg },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chartTitle: { ...typography.heading, color: colors.ink },
  chartCaption: { ...typography.caption, color: colors.muted },
  chart: { height: 150, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.xs },
  barColumn: { flex: 1, alignItems: 'center', gap: 4 },
  barValue: { ...typography.caption, color: colors.muted, fontSize: 10 },
  barTrack: { flex: 1, width: '62%', justifyContent: 'flex-end', borderRadius: radius.pill, overflow: 'hidden', backgroundColor: colors.surfaceAlt },
  bar: { width: '100%', borderRadius: radius.pill },
  dayLabel: { ...typography.caption, color: colors.muted },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  achievement: { flexGrow: 1, flexBasis: '45%', alignItems: 'center', gap: 4, padding: spacing.md },
  locked: { opacity: 0.58, backgroundColor: '#F4F3F6' },
  achievementIcon: { width: 52, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ECEAF0' },
  achievementIconUnlocked: { backgroundColor: colors.warningSoft },
  achievementEmoji: { fontSize: 25 },
  achievementTitle: { ...typography.label, color: colors.ink, textAlign: 'center' },
  achievementState: { ...typography.caption, color: colors.muted },
  insight: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.surfaceAlt },
  insightIcon: { width: 42, height: 42, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  insightCopy: { flex: 1, gap: 3 },
  insightTitle: { ...typography.label, color: colors.ink },
  insightText: { ...typography.body, color: colors.inkSoft },
});
