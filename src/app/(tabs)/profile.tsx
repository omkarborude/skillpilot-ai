import { useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Href, useRouter } from 'expo-router';
import { ActionSheet } from '@/components/ActionSheet';
import { EmptyJourney } from '@/components/EmptyJourney';
import { Page } from '@/components/Page';
import { Button, Card, Pill, ProgressBar, SectionHeading } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useJourneyStore } from '@/store/journeyStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { calculateJourneyProgress, techniqueCounts } from '@/utils/learning';

export default function ProfileScreen() {
  const router = useRouter();
  const goal = useJourneyStore((state) => state.goal);
  const plan = useJourneyStore((state) => state.plan);
  const streakDays = useJourneyStore((state) => state.streakDays);
  const xp = useJourneyStore((state) => state.xp);
  const resetJourney = useJourneyStore((state) => state.resetJourney);
  const logout = useAuthStore((state) => state.logout);
  const restartOnboarding = useAuthStore((state) => state.restartOnboarding);
  const [showReset, setShowReset] = useState(false);

  if (!plan || !goal) {
    return (
      <Page tabScreen contentStyle={styles.emptyPage}>
        <EmptyJourney />
      </Page>
    );
  }

  const progress = calculateJourneyProgress(plan);
  const counts = techniqueCounts(plan);

  const shareProgress = async () => {
    await Share.share({
      message: `I’m ${progress}% through my ${plan.title} journey: ${counts.completed} focused techniques completed with SkillPilot AI.`,
    });
  };

  const confirmReset = () => {
    resetJourney();
    restartOnboarding();
    setShowReset(false);
    router.replace('/');
  };

  const handleLogout = () => {
    logout();
    router.replace('/login' as Href);
  };

  return (
    <Page tabScreen contentStyle={styles.page}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}><Text style={styles.avatarText}>OB</Text></View>
        <View style={styles.identity}>
          <Text style={styles.name}>Omkar Borude</Text>
          <Text style={styles.role}>Focused learner • {goal.hobbyName}</Text>
          <View style={styles.badges}>
            <Pill tone="amber">🔥 {streakDays} day streak</Pill>
            <Pill>⭐ {xp} XP</Pill>
          </View>
        </View>
      </View>

      <SectionHeading title="Your learning goal" caption="The useful context behind Nova’s plan." />
      <Card style={styles.goalCard}>
        <View style={styles.goalIcon}>
          <Ionicons name="flag" size={24} color={colors.primary} />
        </View>
        <View style={styles.goalCopy}>
          <Text style={styles.goalTitle}>{plan.title}</Text>
          <Text style={styles.goalOutcome}>{plan.outcome}</Text>
        </View>
        <Text style={styles.goalProgress}>{progress}%</Text>
        <ProgressBar value={progress} />
        <View style={styles.goalMeta}>
          <Text style={styles.metaText}>{goal.dailyMinutes} min/day</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{goal.level.replace('_', ' ')}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{counts.completed}/{counts.total} complete</Text>
        </View>
      </Card>

      <View style={styles.actionsGrid}>
        <Card style={styles.actionCard}>
          <View style={[styles.actionIcon, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="share-social" size={22} color={colors.primary} />
          </View>
          <Text style={styles.actionTitle}>Share progress</Text>
          <Text style={styles.actionCaption}>Send a concise journey update.</Text>
          <Button label="Share" variant="secondary" onPress={() => void shareProgress()} />
        </Card>
        <Card style={styles.actionCard}>
          <View style={[styles.actionIcon, { backgroundColor: colors.successSoft }]}>
            <Ionicons name="map" size={22} color={colors.success} />
          </View>
          <Text style={styles.actionTitle}>Review your plan</Text>
          <Text style={styles.actionCaption}>See what is done and what comes next.</Text>
          <Button label="Open plan" variant="secondary" onPress={() => router.push('/(tabs)/plan')} />
        </Card>
      </View>

      <Card style={styles.productNote}>
        <Ionicons name="information-circle" size={22} color={colors.primary} />
        <View style={styles.productNoteCopy}>
          <Text style={styles.productNoteTitle}>Why there is no settings maze</Text>
          <Text style={styles.productNoteText}>This MVP keeps only actions that help you learn: continue, adapt, review, share, or start a new goal.</Text>
        </View>
      </Card>

      <Button label="Start a different goal" variant="danger" icon="refresh" onPress={() => setShowReset(true)} />
      <Button label="Log out" variant="ghost" icon="log-out-outline" onPress={handleLogout} />

      <ActionSheet
        visible={showReset}
        onClose={() => setShowReset(false)}
        title="Start a different goal?"
        caption="This clears the local journey, practice history, and coach conversation on this device."
      >
        <View style={styles.sheetActions}>
          <Button label="Keep this journey" variant="secondary" onPress={() => setShowReset(false)} />
          <Button label="Clear and start again" variant="danger" onPress={confirmReset} />
        </View>
      </ActionSheet>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.xl },
  emptyPage: { justifyContent: 'center', minHeight: '100%' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatar: { width: 82, height: 82, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.night, borderWidth: 4, borderColor: colors.primarySoft },
  avatarText: { ...typography.title, color: colors.white },
  identity: { flex: 1, gap: 3 },
  name: { ...typography.title, color: colors.ink },
  role: { ...typography.body, color: colors.muted },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  goalCard: { gap: spacing.md, padding: spacing.lg },
  goalIcon: { width: 52, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  goalCopy: { gap: 3 },
  goalTitle: { ...typography.heading, color: colors.ink },
  goalOutcome: { ...typography.body, color: colors.muted },
  goalProgress: { position: 'absolute', right: spacing.lg, top: spacing.lg, ...typography.heading, color: colors.primary },
  goalMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  metaText: { ...typography.caption, color: colors.muted, textTransform: 'capitalize' },
  metaDot: { color: colors.border },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actionCard: { flexGrow: 1, flexBasis: '45%', gap: spacing.xs },
  actionIcon: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  actionTitle: { ...typography.label, color: colors.ink, fontSize: 14 },
  actionCaption: { ...typography.caption, color: colors.muted, flex: 1, minHeight: 36 },
  productNote: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.surfaceAlt },
  productNoteCopy: { flex: 1, gap: 3 },
  productNoteTitle: { ...typography.label, color: colors.ink },
  productNoteText: { ...typography.body, color: colors.inkSoft },
  sheetActions: { gap: spacing.sm },
});
