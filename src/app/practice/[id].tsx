import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActionSheet } from '@/components/ActionSheet';
import { Page } from '@/components/Page';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button, Card, Pill, ProgressBar } from '@/components/ui';
import { useJourneyStore } from '@/store/journeyStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { calculateJourneyProgress } from '@/utils/learning';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remaining = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
}

export default function PracticeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const plan = useJourneyStore((state) => state.plan);
  const setStatus = useJourneyStore((state) => state.setTechniqueStatus);
  const recordPractice = useJourneyStore((state) => state.recordPractice);
  const technique = useMemo(() => plan?.techniques.find((item) => item.id === id), [id, plan]);
  const totalSeconds = (technique?.minutes ?? 10) * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
  const [focusMode, setFocusMode] = useState(true);
  const [metronome, setMetronome] = useState(false);
  const [completeVisible, setCompleteVisible] = useState(false);

  const isRunning = running && secondsLeft > 0;

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => setSecondsLeft((current) => Math.max(0, current - 1)), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  if (!technique || !plan) {
    return (
      <Page contentStyle={styles.missing}>
        <Text style={styles.missingTitle}>Practice is unavailable</Text>
        <Text style={styles.missingCaption}>Choose an unlocked technique from your learning plan.</Text>
        <Button label="Open plan" onPress={() => router.replace('/(tabs)/plan')} />
      </Page>
    );
  }

  const progress = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);
  const allTasksChecked = checkedTasks.length === technique.practiceTasks.length;

  const toggleTask = (taskId: string) => {
    setCheckedTasks((current) =>
      current.includes(taskId) ? current.filter((item) => item !== taskId) : [...current, taskId],
    );
  };

  const completePractice = () => {
    setRunning(false);
    setStatus(technique.id, 'completed');
    recordPractice(Math.max(1, Math.ceil((totalSeconds - secondsLeft) / 60)), technique.id);
    setCompleteVisible(true);
  };

  const toggleTimer = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(totalSeconds);
      setRunning(true);
      return;
    }
    setRunning((current) => !current);
  };

  const updatedProgress = calculateJourneyProgress(
    technique.status === 'completed'
      ? plan
      : {
          ...plan,
          techniques: plan.techniques.map((item) =>
            item.id === technique.id ? { ...item, status: 'completed' as const } : item,
          ),
        },
  );

  return (
    <Page dark contentStyle={styles.page}>
      <LinearGradient colors={[colors.night, '#27165C', colors.night]} style={StyleSheet.absoluteFill} />
      <ScreenHeader title="Practice session" caption={technique.shortTitle} dark />

      <View style={styles.goalCopy}>
        <Pill tone="green">TODAY’S FOCUS</Pill>
        <Text style={styles.title}>{technique.shortTitle}</Text>
        <Text style={styles.caption}>Finish clean repetitions, then reflect before moving on.</Text>
      </View>

      <View style={styles.timerWrap}>
        <View style={styles.timerOuter}>
          <View style={styles.timerInner}>
            <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
            <Text style={styles.timerLabel}>{isRunning ? 'Stay relaxed' : 'Time left'}</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isRunning ? 'Pause timer' : 'Start timer'}
          onPress={toggleTimer}
          style={({ pressed }) => [styles.timerButton, pressed && styles.pressed]}
        >
          <Ionicons name={isRunning ? 'pause' : 'play'} size={27} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.progressCopy}>
        <Text style={styles.progressLabel}>Session progress</Text>
        <Text style={styles.progressValue}>{progress}%</Text>
      </View>
      <ProgressBar value={progress} dark />

      <Card style={styles.checklistCard}>
        <View style={styles.checklistHeader}>
          <View>
            <Text style={styles.checklistTitle}>Practice checklist</Text>
            <Text style={styles.checklistCaption}>{checkedTasks.length} of {technique.practiceTasks.length} cues complete</Text>
          </View>
          <View style={styles.checklistCount}>
            <Text style={styles.checklistCountText}>{checkedTasks.length}/{technique.practiceTasks.length}</Text>
          </View>
        </View>
        {technique.practiceTasks.map((task) => {
          const checked = checkedTasks.includes(task.id);
          return (
            <Pressable
              key={task.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              onPress={() => toggleTask(task.id)}
              style={({ pressed }) => [styles.taskRow, pressed && styles.pressed]}
            >
              <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked ? <Ionicons name="checkmark" size={17} color={colors.white} /> : null}
              </View>
              <Text style={[styles.taskText, checked && styles.taskTextChecked]}>{task.label}</Text>
            </Pressable>
          );
        })}
      </Card>

      <View style={styles.toolsRow}>
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: focusMode }}
          onPress={() => setFocusMode((current) => !current)}
          style={[styles.tool, focusMode && styles.toolActive]}
        >
          <Ionicons name="leaf" size={20} color={focusMode ? colors.cyan : '#C5BFDC'} />
          <View style={styles.toolCopy}>
            <Text style={styles.toolTitle}>Focus mode</Text>
            <Text style={styles.toolState}>{focusMode ? 'On' : 'Off'}</Text>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: metronome }}
          onPress={() => setMetronome((current) => !current)}
          style={[styles.tool, metronome && styles.toolActive]}
        >
          <Ionicons name="pulse" size={20} color={metronome ? colors.cyan : '#C5BFDC'} />
          <View style={styles.toolCopy}>
            <Text style={styles.toolTitle}>Metronome</Text>
            <Text style={styles.toolState}>{metronome ? '60 BPM' : 'Off'}</Text>
          </View>
        </Pressable>
      </View>

      <Button
        label={allTasksChecked ? 'Complete technique' : 'Check every practice cue'}
        icon={allTasksChecked ? 'checkmark-circle' : undefined}
        disabled={!allTasksChecked}
        onPress={completePractice}
      />

      <ActionSheet
        visible={completeVisible}
        onClose={() => setCompleteVisible(false)}
        title="Technique complete! 🎉"
        caption={`You resolved ${technique.shortTitle} and unlocked the next useful step.`}
      >
        <View style={styles.completionContent}>
          <View style={styles.completionProgress}>
            <Text style={styles.completionValue}>{updatedProgress}%</Text>
            <Text style={styles.completionLabel}>journey resolved</Text>
          </View>
          <View style={styles.completionCopy}>
            <Text style={styles.completionTitle}>+25 XP earned</Text>
            <Text style={styles.completionText}>Progress is saved locally and will still be here when the app reopens.</Text>
          </View>
        </View>
        <Button label="See what’s next" icon="arrow-forward" onPress={() => router.replace('/(tabs)/plan')} />
        <Button label="Back to dashboard" variant="secondary" onPress={() => router.replace('/(tabs)')} />
      </ActionSheet>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { minHeight: '100%', gap: spacing.xl },
  missing: { minHeight: '100%', alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  missingTitle: { ...typography.title, color: colors.ink },
  missingCaption: { ...typography.body, color: colors.muted, textAlign: 'center' },
  goalCopy: { alignItems: 'center', gap: spacing.xs },
  title: { ...typography.title, color: colors.white, textAlign: 'center' },
  caption: { ...typography.body, color: '#CFC8E7', textAlign: 'center' },
  timerWrap: { alignItems: 'center', justifyContent: 'center', minHeight: 240 },
  timerOuter: { width: 220, height: 220, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', borderWidth: 10, borderColor: colors.cyan, backgroundColor: 'rgba(255,255,255,0.04)' },
  timerInner: { width: 172, height: 172, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.nightSoft },
  timer: { fontSize: 43, lineHeight: 50, fontWeight: '800', color: colors.white, fontVariant: ['tabular-nums'] },
  timerLabel: { ...typography.caption, color: '#C6BFDE' },
  timerButton: { position: 'absolute', bottom: 0, width: 60, height: 60, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderWidth: 5, borderColor: colors.night },
  progressCopy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressLabel: { ...typography.caption, color: '#CFC8E7' },
  progressValue: { ...typography.label, color: colors.cyan },
  checklistCard: { gap: spacing.md, padding: spacing.lg },
  checklistHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  checklistTitle: { ...typography.heading, color: colors.ink },
  checklistCaption: { ...typography.caption, color: colors.muted },
  checklistCount: { width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  checklistCountText: { ...typography.label, color: colors.primary },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44 },
  checkbox: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.border },
  checkboxChecked: { backgroundColor: colors.success, borderColor: colors.success },
  taskText: { ...typography.body, color: colors.inkSoft, flex: 1 },
  taskTextChecked: { color: colors.muted, textDecorationLine: 'line-through' },
  toolsRow: { flexDirection: 'row', gap: spacing.xs },
  tool: { flex: 1, minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderRadius: radius.md, padding: spacing.sm, backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  toolActive: { borderColor: 'rgba(33,200,195,0.46)', backgroundColor: 'rgba(33,200,195,0.1)' },
  toolCopy: { flex: 1 },
  toolTitle: { ...typography.label, color: colors.white, fontSize: 13 },
  toolState: { ...typography.caption, color: '#C6BFDE' },
  completionContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  completionProgress: { width: 94, height: 94, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.successSoft, borderWidth: 7, borderColor: colors.success },
  completionValue: { ...typography.heading, color: colors.success },
  completionLabel: { ...typography.caption, color: colors.muted, fontSize: 10 },
  completionCopy: { flex: 1, gap: 3 },
  completionTitle: { ...typography.heading, color: colors.ink },
  completionText: { ...typography.body, color: colors.muted },
  pressed: { opacity: 0.76 },
});
