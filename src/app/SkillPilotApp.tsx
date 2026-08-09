import { StatusBar } from 'expo-status-bar';
import type { PropsWithChildren } from 'react';
import { useMemo, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { aiPrompts, aiSteps } from '../data/seed';
import { aiService, type CoachResponse } from '../services/ai/aiService';
import { useSkillPilotState } from '../state/useSkillPilotState';
import type { ScreenName, SkillLevel, Technique } from '../types/learning';
import { calculateProgress } from '../utils/progress';
import { Card, Pill, PrimaryButton, ProgressBar } from '../components/ui';
import { colors, radii, spacing } from './theme';

const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];
const times = [10, 20, 30, 45];
const tabs: Array<{ screen: ScreenName; label: string }> = [
  { screen: 'dashboard', label: 'Home' },
  { screen: 'plan', label: 'Plan' },
  { screen: 'coach', label: 'AI' },
  { screen: 'progress', label: 'Progress' },
  { screen: 'profile', label: 'Profile' },
];

export function SkillPilotApp() {
  const learning = useSkillPilotState();
  const [screen, setScreen] = useState<ScreenName>('createGoal');
  const completedCount = learning.state.completedTechniqueIds.length;
  const progress = calculateProgress(completedCount, learning.techniques.length);

  function go(next: ScreenName) {
    setScreen(next);
  }

  const content = useMemo(() => {
    const props = { ...learning, progress, go };
    switch (screen) {
      case 'createGoal': return <CreateGoalScreen {...props} />;
      case 'aiPlan': return <AIPlanScreen {...props} />;
      case 'dashboard': return <DashboardScreen {...props} />;
      case 'plan': return <LearningPlanScreen {...props} />;
      case 'technique': return <TechniqueScreen {...props} />;
      case 'practice': return <PracticeScreen {...props} />;
      case 'coach': return <CoachScreen {...props} />;
      case 'progress': return <ProgressScreen {...props} />;
      case 'profile': return <ProfileScreen {...props} />;
    }
  }, [learning, progress, screen]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.topBar}><Text style={styles.logo}>✦ SkillPilot AI</Text></View>
      <ScrollView contentContainerStyle={styles.content}>{content}</ScrollView>
      {screen !== 'createGoal' && screen !== 'aiPlan' ? <BottomTabs current={screen} onSelect={go} /> : null}
    </SafeAreaView>
  );
}

type ScreenProps = ReturnType<typeof useSkillPilotState> & { progress: number; go: (screen: ScreenName) => void };

function CreateGoalScreen({ state, setGoal, go }: ScreenProps) {
  const [hobby, setHobby] = useState(state.goal.hobby);
  const [goal, setGoalText] = useState(state.goal.goal);
  const [level, setLevel] = useState<SkillLevel>(state.goal.level);
  const [dailyMinutes, setDailyMinutes] = useState(state.goal.dailyMinutes);
  return (
    <View style={styles.stack}>
      <Text style={styles.eyebrow}>Create Goal</Text>
      <Text style={styles.heroTitle}>What do you want to get better at?</Text>
      <Card title="One focused path" subtitle="No separate onboarding maze. Tell SkillPilot what matters and get a realistic plan.">
        <Field label="Hobby" value={hobby} onChangeText={setHobby} />
        <Field label="Goal" value={goal} onChangeText={setGoalText} multiline />
        <Text style={styles.label}>Your level</Text><View style={styles.choiceRow}>{levels.map((item) => <Pill key={item} label={item} selected={item === level} onPress={() => setLevel(item)} />)}</View>
        <Text style={styles.label}>Time available</Text><View style={styles.choiceRow}>{times.map((item) => <Pill key={item} label={item === 45 ? '45+ min' : `${item} min`} selected={item === dailyMinutes} onPress={() => setDailyMinutes(item)} />)}</View>
        <PrimaryButton label="Create my learning plan" onPress={() => { setGoal({ hobby, goal, level, dailyMinutes }); go('aiPlan'); }} />
      </Card>
    </View>
  );
}

function AIPlanScreen({ state, go }: ScreenProps) {
  return (
    <View style={styles.stack}>
      <Text style={styles.heroTitle}>Building your learning path</Text>
      <Card subtitle="Your plan will contain only the skills that matter for your goal.">
        {aiSteps.map((step, index) => <View key={step} style={styles.stepRow}><Text style={styles.check}>{index < 3 ? '✓' : '•'}</Text><Text style={styles.stepText}>{step}</Text></View>)}
        <View style={styles.summaryRow}><Pill label="6 techniques" selected /><Pill label={`${state.goal.dailyMinutes} min/day`} selected /><Pill label={`${state.goal.level} friendly`} selected /></View>
        <PrimaryButton label="Start Learning" onPress={() => go('dashboard')} />
      </Card>
    </View>
  );
}

function DashboardScreen({ state, currentTechnique, progress, go }: ScreenProps) {
  return (
    <View style={styles.stack}>
      <GradientHero title={state.plan.title} eyebrow="Good evening, Omkar 👋" body={state.goal.goal}><ProgressBar value={progress} /><Text style={styles.heroMeta}>{progress}% complete</Text></GradientHero>
      <Card title="Today's mission" subtitle={currentTechnique.reason}><View style={styles.splitRow}><Text style={styles.cardHeadline}>{currentTechnique.title}</Text><Pill label={`${state.goal.dailyMinutes} min`} selected /></View><PrimaryButton label="Continue" onPress={() => go('technique')} /></Card>
      <Card title="AI Insight" subtitle="You've been consistent this week. Focus on chord transitions today before moving to rhythm." />
      <View style={styles.twoColumn}><Metric label="day streak" value={String(state.streak)} /><Metric label="next resource" value={currentTechnique.resources[0]?.title ?? 'Ready'} small /></View>
    </View>
  );
}

function LearningPlanScreen({ techniques, progress, selectTechnique, go }: ScreenProps) {
  return (
    <View style={styles.stack}>
      <Text style={styles.eyebrow}>Learning Plan</Text><Text style={styles.heroTitle}>Your focused path</Text><ProgressBar value={progress} />
      {techniques.map((technique, index) => <Pressable key={technique.id} accessibilityRole="button" style={styles.techniqueRow} onPress={() => { selectTechnique(technique.id); go('technique'); }}><Text style={[styles.statusDot, statusStyle(technique.status)]}>{technique.status === 'completed' ? '✓' : index + 1}</Text><View style={styles.flex}><Text style={styles.cardHeadline}>{technique.title}</Text><Text style={styles.muted}>{technique.difficulty} · {technique.estimatedMinutes} min</Text><Text style={styles.muted}>Why: {technique.reason}</Text></View><Text style={styles.statusText}>{technique.status}</Text></Pressable>)}
    </View>
  );
}

function TechniqueScreen({ selectedTechnique, skipTechnique, replaceTechnique, go }: ScreenProps) {
  const [dialog, setDialog] = useState<'skip' | 'replace' | null>(null);
  return (
    <View style={styles.stack}>
      <GradientHero title={selectedTechnique.title} eyebrow={`${selectedTechnique.difficulty} · ${selectedTechnique.estimatedMinutes} min`} body={selectedTechnique.description} />
      <Card title="Why this matters" subtitle={selectedTechnique.reason} />
      <Card title="Learn">{selectedTechnique.resources.map((resource) => <ResourceItem key={resource.id} title={resource.title} meta={`${resource.type} · ${resource.durationMinutes} min · ${resource.source}`} />)}</Card>
      <Card title="Practice">{selectedTechnique.checklist.map((item) => <ChecklistItem key={item} label={item} />)}<View style={styles.choiceRow}><PrimaryButton label="Start Practice" onPress={() => go('practice')} /><PrimaryButton muted label="Ask AI" onPress={() => go('coach')} /></View></Card>
      <View style={styles.choiceRow}><PrimaryButton muted label="Skip" onPress={() => setDialog('skip')} /><PrimaryButton muted label="Replace" onPress={() => setDialog('replace')} /></View>
      <ConfirmModal visible={dialog !== null} title={dialog === 'skip' ? 'Skip this technique?' : 'Replace this technique?'} body="SkillPilot will keep the path focused and help you continue without overload." onClose={() => setDialog(null)} onConfirm={() => { dialog === 'skip' ? skipTechnique(selectedTechnique.id) : replaceTechnique(selectedTechnique.id); setDialog(null); go(dialog === 'skip' ? 'plan' : 'coach'); }} />
    </View>
  );
}

function PracticeScreen({ selectedTechnique, completeTechnique, go }: ScreenProps) {
  const [started, setStarted] = useState(false);
  const [notes, setNotes] = useState('');
  const [reflection, setReflection] = useState('');
  async function complete() {
    completeTechnique(selectedTechnique.id, selectedTechnique.estimatedMinutes, notes);
    setReflection(await aiService.reflect(selectedTechnique));
  }
  if (reflection) return <View style={styles.stack}><Card title="Nice work ✨" subtitle={reflection}><PrimaryButton label="Continue" onPress={() => go('progress')} /></Card></View>;
  return <View style={styles.stack}><Card title={selectedTechnique.title} subtitle="Keep it simple. One focused session is enough for today."><Text style={styles.timer}>{started ? `${selectedTechnique.estimatedMinutes}:00` : '20:00'}</Text><PrimaryButton muted={started} label={started ? 'Pause' : 'Start'} onPress={() => setStarted(!started)} />{selectedTechnique.checklist.map((item) => <ChecklistItem key={item} label={item} />)}<Field label="Notes" value={notes} onChangeText={setNotes} multiline /><PrimaryButton label="Complete Practice" onPress={complete} /></Card></View>;
}

function CoachScreen({ state, selectedTechnique }: ScreenProps) {
  const [answer, setAnswer] = useState<CoachResponse | null>(null);
  return <View style={styles.stack}><GradientHero title={`You're learning ${selectedTechnique.title}.`} eyebrow="AI Coach" body="How can I help?" />{aiPrompts.map((prompt) => <PrimaryButton key={prompt} muted label={prompt} onPress={async () => setAnswer(await aiService.coach(prompt, state, selectedTechnique))} />)}{answer ? <Card title={answer.title} subtitle={answer.message}><Text style={styles.cardHeadline}>{answer.nextStep}</Text></Card> : null}</View>;
}

function ProgressScreen({ state, progress, techniques }: ScreenProps) {
  const totalMinutes = state.practiceHistory.reduce((sum, session) => sum + session.minutes, 0);
  return <View style={styles.stack}><GradientHero title={`${progress}%`} eyebrow="Overall Progress" body="Progress is obvious, focused, and actionable."><ProgressBar value={progress} /></GradientHero><View style={styles.twoColumn}><Metric label="techniques" value={`${state.completedTechniqueIds.length}/${techniques.length}`} /><Metric label="practice" value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`} /></View><Metric label="consistency" value="82%" /><Card title="This Week"><View style={styles.weekRow}>{['Mon ✓', 'Tue ✓', 'Wed -', 'Thu ✓', 'Fri ✓', 'Sat -', 'Sun -'].map((day) => <Text key={day} style={styles.weekPill}>{day}</Text>)}</View></Card><Card title="Achievements" subtitle="7 Day Streak · First Chord · Consistent Learner" /></View>;
}

function ProfileScreen({ state, reset }: ScreenProps) {
  return <View style={styles.stack}><Card title="Profile" subtitle="Intentionally small settings for the current journey."><Text style={styles.avatar}>OB</Text><Info label="Name" value="Omkar Borude" /><Info label="Current hobby" value={state.goal.hobby} /><Info label="Current goal" value={state.goal.goal} /><Info label="Skill level" value={state.goal.level} /><Info label="Daily practice target" value={`${state.goal.dailyMinutes} minutes`} /><PrimaryButton muted label="Reset learning plan" onPress={reset} /></Card></View>;
}

function BottomTabs({ current, onSelect }: { current: ScreenName; onSelect: (screen: ScreenName) => void }) {
  return <View style={styles.tabs}>{tabs.map((tab) => <Pressable key={tab.screen} accessibilityRole="tab" accessibilityState={{ selected: current === tab.screen }} style={[styles.tab, current === tab.screen && styles.tabActive]} onPress={() => onSelect(tab.screen)}><Text style={[styles.tabText, current === tab.screen && styles.tabTextActive]}>{tab.label}</Text></Pressable>)}</View>;
}

function Field({ label, value, onChangeText, multiline = false }: { label: string; value: string; onChangeText: (value: string) => void; multiline?: boolean }) {
  return <View><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} multiline={multiline} style={[styles.input, multiline && styles.textArea]} /></View>;
}

function GradientHero({ eyebrow, title, body, children }: PropsWithChildren<{ eyebrow: string; title: string; body: string }>) {
  return <View style={styles.hero}><Text style={styles.heroEyebrow}>{eyebrow}</Text><Text style={styles.heroTitleLight}>{title}</Text><Text style={styles.heroBody}>{body}</Text>{children}</View>;
}
function statusStyle(status: Technique['status']) {
  if (status === 'completed') return styles.status_completed;
  if (status === 'skipped') return styles.status_skipped;
  if (status === 'locked') return styles.status_locked;
  return styles.status_available;
}
function Metric({ label, value, small = false }: { label: string; value: string; small?: boolean }) { return <Card><Text style={[styles.metricValue, small && styles.metricSmall]}>{value}</Text><Text style={styles.muted}>{label}</Text></Card>; }
function ResourceItem({ title, meta }: { title: string; meta: string }) { return <View style={styles.resource}><Text style={styles.cardHeadline}>{title}</Text><Text style={styles.muted}>{meta}</Text></View>; }
function ChecklistItem({ label }: { label: string }) { return <Text style={styles.checklist}>✓ {label}</Text>; }
function Info({ label, value }: { label: string; value: string }) { return <View style={styles.infoRow}><Text style={styles.muted}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>; }
function ConfirmModal({ visible, title, body, onClose, onConfirm }: { visible: boolean; title: string; body: string; onClose: () => void; onConfirm: () => void }) { return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}><View style={styles.modalBackdrop}><View style={styles.modalSheet}><Text style={styles.cardHeadline}>{title}</Text><Text style={styles.muted}>{body}</Text><View style={styles.choiceRow}><PrimaryButton muted label="Cancel" onPress={onClose} /><PrimaryButton label="Confirm" onPress={onConfirm} /></View></View></View></Modal>; }

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  topBar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: 'rgba(255,255,255,0.92)' },
  logo: { color: colors.text, fontWeight: '900', fontSize: 17 },
  content: { padding: spacing.lg, paddingBottom: 118 },
  stack: { gap: spacing.md },
  flex: { flex: 1 },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '900', letterSpacing: 1.4, textTransform: 'uppercase' },
  label: { color: colors.text, fontWeight: '800', marginBottom: spacing.xs },
  heroTitle: { color: colors.text, fontSize: 42, lineHeight: 44, fontWeight: '900', letterSpacing: -2.2 },
  hero: { gap: spacing.sm, padding: spacing.xl, borderRadius: 32, backgroundColor: colors.ink },
  heroEyebrow: { color: '#C8C2FF', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.2 },
  heroTitleLight: { color: '#FFFFFF', fontSize: 38, lineHeight: 40, fontWeight: '900', letterSpacing: -1.8 },
  heroBody: { color: '#DAD7FF', fontSize: 15, lineHeight: 23 },
  heroMeta: { color: '#FFFFFF', fontWeight: '800' },
  input: { minHeight: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: radii.md, paddingHorizontal: spacing.md, color: colors.text, backgroundColor: '#FFFFFF' },
  textArea: { minHeight: 104, paddingTop: spacing.md, textAlignVertical: 'top' },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' },
  summaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 34 },
  check: { color: colors.success, fontSize: 18, fontWeight: '900' },
  stepText: { color: colors.text, fontWeight: '800' },
  splitRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  cardHeadline: { color: colors.text, fontSize: 17, fontWeight: '900' },
  muted: { color: colors.muted, lineHeight: 21 },
  twoColumn: { flexDirection: 'row', gap: spacing.md },
  techniqueRow: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.surface, alignItems: 'flex-start' },
  statusDot: { width: 34, height: 34, overflow: 'hidden', borderRadius: 17, color: '#FFFFFF', textAlign: 'center', lineHeight: 34, fontWeight: '900', backgroundColor: colors.primary },
  status_completed: { backgroundColor: colors.success },
  status_available: { backgroundColor: colors.primary },
  status_locked: { backgroundColor: '#A8AAB8' },
  status_skipped: { backgroundColor: colors.warning },
  statusText: { color: colors.primary, fontWeight: '800', textTransform: 'capitalize' },
  resource: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#EEF0F6' },
  checklist: { color: colors.text, fontSize: 16, paddingVertical: spacing.xs },
  timer: { color: colors.primary, fontSize: 72, fontWeight: '900', textAlign: 'center', letterSpacing: -4 },
  metricValue: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: -1.4 },
  metricSmall: { fontSize: 17, letterSpacing: -0.3 },
  weekRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  weekPill: { color: colors.text, fontWeight: '800', padding: spacing.sm, borderRadius: 14, backgroundColor: '#F2F3F8' },
  avatar: { width: 74, height: 74, overflow: 'hidden', borderRadius: 28, backgroundColor: colors.primary, color: '#FFFFFF', textAlign: 'center', lineHeight: 74, fontSize: 24, fontWeight: '900' },
  infoRow: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#EEF0F6' },
  infoValue: { color: colors.text, fontWeight: '800', marginTop: 3 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(17,24,39,0.35)' },
  modalSheet: { gap: spacing.md, padding: spacing.lg, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.surface },
  tabs: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.md, flexDirection: 'row', gap: spacing.xs, padding: spacing.xs, borderRadius: 24, backgroundColor: '#FFFFFF', shadowColor: '#111827', shadowOpacity: 0.14, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  tab: { flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  tabActive: { backgroundColor: '#F0EEFF' },
  tabText: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  tabTextActive: { color: colors.primary },
});
