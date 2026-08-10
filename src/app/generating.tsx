import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, type Href, useRouter } from 'expo-router';
import { Page } from '@/components/Page';
import { RobotMascot } from '@/components/RobotMascot';
import { Button, Card, Pill } from '@/components/ui';
import { aiProvider } from '@/services/aiProvider';
import { useAuthStore } from '@/store/authStore';
import { useJourneyStore } from '@/store/journeyStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export default function GeneratingScreen() {
  const router = useRouter();
  const goal = useJourneyStore((state) => state.goal);
  const setPlan = useJourneyStore((state) => state.setPlan);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const startedAttempt = useRef(-1);

  useEffect(() => {
    if (!isAuthenticated || !goal || startedAttempt.current === attempt) return;
    startedAttempt.current = attempt;
    let cancelled = false;

    const generate = async () => {
      try {
        const plan = await aiProvider.generatePlan(goal);
        if (!cancelled) {
          setPlan(plan);
          setReady(true);
        }
      } catch (generationError) {
        if (!cancelled) {
          setError(
            generationError instanceof Error
              ? generationError.message
              : 'The plan could not be prepared. Your goal is saved, so you can retry.',
          );
        }
      }
    };
    void generate();

    return () => {
      cancelled = true;
    };
  }, [attempt, goal, isAuthenticated, setPlan]);

  const retry = () => {
    setError('');
    setReady(false);
    setAttempt((current) => current + 1);
  };

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (!goal) {
    return (
      <Page contentStyle={styles.centered}>
        <RobotMascot size="large" />
        <Text style={styles.title}>Tell Nova your goal first</Text>
        <Button label="Create a goal" onPress={() => router.replace('/onboarding' as Href)} />
      </Page>
    );
  }

  return (
    <Page dark contentStyle={styles.page}>
      <LinearGradient colors={[colors.night, '#241657', '#17103D']} style={StyleSheet.absoluteFill} />
      <View style={styles.hero}>
        <RobotMascot size="large" />
        <Pill tone={ready ? 'green' : 'purple'}>{ready ? 'Plan ready' : 'Nova is thinking'}</Pill>
        <Text style={styles.title}>{ready ? `Your ${goal.hobbyName} path is ready.` : `Building a plan around you.`}</Text>
        <Text style={styles.caption}>
          {ready
            ? 'A focused sequence, the right media for each skill, and a realistic next action.'
            : `${goal.dailyMinutes} minutes a day • ${goal.level.replace('_', ' ')} • ${goal.hobbyName}`}
        </Text>
      </View>

      <Card style={styles.stepsCard}>
        {!ready && !error ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <View style={styles.loadingCopy}>
              <Text style={styles.loadingTitle}>Creating your plan</Text>
              <Text style={styles.loadingCaption}>This can take up to a minute when the service is starting.</Text>
            </View>
          </View>
        ) : null}
        {ready ? (
          <View style={styles.readyState}>
            <Ionicons name="checkmark-circle" size={26} color={colors.success} />
            <Text style={styles.readyText}>Your plan was created successfully.</Text>
          </View>
        ) : null}
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        {error ? <Button label="Retry plan generation" variant="secondary" icon="refresh" onPress={retry} /> : null}
        <Button
          label={ready ? 'Open my learning plan' : 'Preparing your plan…'}
          icon={ready ? 'arrow-forward' : undefined}
          disabled={!ready || Boolean(error)}
          onPress={() => {
            completeOnboarding();
            router.replace('/(tabs)');
          }}
        />
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { minHeight: '100%', gap: spacing.xl, justifyContent: 'center' },
  centered: { minHeight: '100%', justifyContent: 'center', alignItems: 'center', gap: spacing.lg },
  hero: { alignItems: 'center', gap: spacing.sm },
  title: { ...typography.title, color: colors.white, textAlign: 'center', maxWidth: 560 },
  caption: { ...typography.body, color: '#CEC6E8', textAlign: 'center', maxWidth: 560 },
  stepsCard: { gap: spacing.lg, padding: spacing.lg },
  loadingState: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  loadingCopy: { flex: 1, gap: 3 },
  loadingTitle: { ...typography.heading, color: colors.ink },
  loadingCaption: { ...typography.body, color: colors.muted },
  readyState: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.successSoft },
  readyText: { ...typography.body, color: colors.inkSoft, flex: 1 },
  errorBox: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center', borderRadius: radius.md, backgroundColor: colors.dangerSoft, padding: spacing.sm },
  errorText: { ...typography.caption, color: colors.danger, flex: 1 },
});
