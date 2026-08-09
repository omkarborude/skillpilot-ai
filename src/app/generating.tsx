import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Page } from '@/components/Page';
import { RobotMascot } from '@/components/RobotMascot';
import { Button, Card, Pill, ProgressBar } from '@/components/ui';
import { generationSteps } from '@/constants/product';
import { aiProvider } from '@/services/aiProvider';
import { useJourneyStore } from '@/store/journeyStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export default function GeneratingScreen() {
  const router = useRouter();
  const goal = useJourneyStore((state) => state.goal);
  const setPlan = useJourneyStore((state) => state.setPlan);
  const [activeStep, setActiveStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const started = useRef(false);

  useEffect(() => {
    if (!goal || started.current) return;
    started.current = true;
    let cancelled = false;
    const timeouts = generationSteps.map((_, index) =>
      setTimeout(() => {
        if (!cancelled) setActiveStep(index + 1);
      }, 550 * (index + 1)),
    );

    const generate = async () => {
      try {
        const plan = await aiProvider.generatePlan(goal);
        await new Promise<void>((resolve) => setTimeout(resolve, generationSteps.length * 550 + 250));
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
      timeouts.forEach(clearTimeout);
    };
  }, [goal, setPlan]);

  if (!goal) {
    return (
      <Page contentStyle={styles.centered}>
        <RobotMascot size="large" />
        <Text style={styles.title}>Tell Nova your goal first</Text>
        <Button label="Create a goal" onPress={() => router.replace('/')} />
      </Page>
    );
  }

  const progress = ready ? 100 : Math.round((activeStep / generationSteps.length) * 92);

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
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Personalizing your roadmap</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>
        <ProgressBar value={progress} />
        <View style={styles.steps}>
          {generationSteps.map((step, index) => {
            const complete = index < activeStep || ready;
            const active = index === activeStep && !ready;
            return (
              <View key={step.title} style={styles.step}>
                <View style={[styles.stepIcon, complete && styles.stepIconComplete, active && styles.stepIconActive]}>
                  <Ionicons
                    name={complete ? 'checkmark' : active ? 'sparkles' : 'ellipse-outline'}
                    size={18}
                    color={complete ? colors.white : active ? colors.primary : colors.muted}
                  />
                </View>
                <View style={styles.stepCopy}>
                  <Text style={[styles.stepTitle, !complete && !active && styles.stepPending]}>{step.title}</Text>
                  <Text style={styles.stepCaption}>{step.caption}</Text>
                </View>
              </View>
            );
          })}
        </View>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        <Button
          label={ready ? 'Open my learning plan' : 'Preparing your plan…'}
          icon={ready ? 'arrow-forward' : undefined}
          disabled={!ready}
          onPress={() => router.replace('/(tabs)')}
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
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressLabel: { ...typography.label, color: colors.ink },
  progressValue: { ...typography.label, color: colors.primary },
  steps: { gap: spacing.md },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepIcon: { width: 36, height: 36, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F0F4' },
  stepIconComplete: { backgroundColor: colors.success },
  stepIconActive: { backgroundColor: colors.primarySoft },
  stepCopy: { flex: 1, gap: 2 },
  stepTitle: { ...typography.label, color: colors.ink },
  stepPending: { color: colors.muted },
  stepCaption: { ...typography.caption, color: colors.muted },
  errorBox: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center', borderRadius: radius.md, backgroundColor: colors.dangerSoft, padding: spacing.sm },
  errorText: { ...typography.caption, color: colors.danger, flex: 1 },
});
