import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, type Href, useRouter } from 'expo-router';
import { Page } from '@/components/Page';
import { RobotMascot } from '@/components/RobotMascot';
import { Button, Card, Pill } from '@/components/ui';
import { generationSteps } from '@/constants/product';
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
      } catch {
        if (!cancelled) setError('The plan could not be prepared. Your goal is saved, so you can retry safely.');
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
        <Pill tone={ready ? 'green' : 'purple'}>{ready ? 'Plan ready' : 'Preparing your plan'}</Pill>
        <Text style={styles.title}>{ready ? `Your ${goal.hobbyName} path is ready.` : `Building a plan around you.`}</Text>
        <Text style={styles.caption}>
          {ready
            ? 'A practical sequence, recommended searches, and a realistic next action.'
            : `${goal.dailyMinutes} minutes a day • ${goal.level.replace('_', ' ')} • ${goal.hobbyName}`}
        </Text>
      </View>

      <Card style={styles.stepsCard}>
        <Text style={styles.progressLabel}>{ready ? 'Included in your plan' : 'What Nova is preparing'}</Text>
        <View style={styles.steps}>
          {generationSteps.map((step) => (
            <View key={step.title} style={styles.step}>
              <View style={[styles.stepIcon, ready && styles.stepIconComplete]}>
                <Ionicons
                  name={ready ? 'checkmark' : 'ellipse-outline'}
                  size={18}
                  color={ready ? colors.white : colors.muted}
                />
              </View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepCaption}>{step.caption}</Text>
              </View>
            </View>
          ))}
        </View>
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
  progressLabel: { ...typography.label, color: colors.ink },
  steps: { gap: spacing.md },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepIcon: { width: 36, height: 36, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F0F4' },
  stepIconComplete: { backgroundColor: colors.success },
  stepCopy: { flex: 1, gap: 2 },
  stepTitle: { ...typography.label, color: colors.ink },
  stepCaption: { ...typography.caption, color: colors.muted },
  errorBox: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center', borderRadius: radius.md, backgroundColor: colors.dangerSoft, padding: spacing.sm },
  errorText: { ...typography.caption, color: colors.danger, flex: 1 },
});
