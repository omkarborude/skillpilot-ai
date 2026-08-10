import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { EmptyJourney } from '@/components/EmptyJourney';
import { Page } from '@/components/Page';
import { RobotMascot } from '@/components/RobotMascot';
import { Pill } from '@/components/ui';
import { aiProvider } from '@/services/aiProvider';
import { useJourneyStore } from '@/store/journeyStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { CoachMessage, CoachRole } from '@/types/learning';
import { calculateJourneyProgress, getActiveTechnique } from '@/utils/learning';

function createMessage(role: CoachRole, content: string): CoachMessage {
  const createdAt = Date.now();
  return { id: `${role}-${createdAt}`, role, content, createdAt };
}

const quickActions = [
  { label: 'Explain simply', icon: 'bulb-outline' as const, prompt: 'Explain this more simply' },
  { label: 'Show an easier way', icon: 'git-branch-outline' as const, prompt: 'Show me an easier way' },
  { label: 'Practice together', icon: 'fitness-outline' as const, prompt: 'Practice this with me' },
  { label: 'Quiz me', icon: 'help-circle-outline' as const, prompt: 'Quiz me on this technique' },
];

export default function CoachScreen() {
  const plan = useJourneyStore((state) => state.plan);
  const messages = useJourneyStore((state) => state.coachMessages);
  const addMessage = useJourneyStore((state) => state.addCoachMessage);
  const goal = useJourneyStore((state) => state.goal);
  const activeTechnique = getActiveTechnique(plan);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  if (!plan || !goal) {
    return (
      <Page tabScreen contentStyle={styles.emptyPage}>
        <EmptyJourney />
      </Page>
    );
  }

  const send = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || loading) return;
    setInput('');
    setLoading(true);
    setRequestError('');
    const learnerMessage = createMessage('learner', trimmed);
    addMessage(learnerMessage);
    try {
      const response = await aiProvider.answerCoach(trimmed, {
        goal,
        technique: activeTechnique,
        journeyProgress: calculateJourneyProgress(plan),
        recentMessages: [...messages, learnerMessage],
      });
      addMessage(createMessage('coach', response));
    } catch {
      setInput(trimmed);
      setRequestError('Nova could not respond right now. Your message is saved—retry when the service is available.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page scroll={false} keyboardAware tabScreen contentStyle={styles.page}>
      <LinearGradient colors={[colors.night, '#2B176F']} style={styles.coachHeader}>
        <View style={styles.coachIdentity}>
          <RobotMascot size="small" />
          <View style={styles.coachCopy}>
            <View style={styles.nameRow}>
              <Text style={styles.coachName}>Nova</Text>
              <View style={styles.onlineDot} />
            </View>
            <Text style={styles.coachCaption}>Contextual coach for your current technique</Text>
          </View>
        </View>
        <Pill tone="green">Focused on {activeTechnique?.shortTitle ?? plan.title}</Pill>
      </LinearGradient>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messageContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => {
          const coach = message.role === 'coach';
          return (
            <View key={message.id} style={[styles.messageRow, !coach && styles.messageRowLearner]}>
              {coach ? <RobotMascot size="small" /> : null}
              <View style={[styles.bubble, coach ? styles.coachBubble : styles.learnerBubble]}>
                <Text style={[styles.messageText, !coach && styles.learnerText]}>{message.content}</Text>
              </View>
            </View>
          );
        })}
        {loading ? (
          <View style={styles.messageRow}>
            <RobotMascot size="small" />
            <View style={styles.typingBubble}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
          </View>
        ) : null}
        {requestError ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={colors.danger} />
            <Text style={styles.errorText}>{requestError}</Text>
          </View>
        ) : null}

        <Text style={styles.quickLabel}>QUICK COACHING</Text>
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              onPress={() => void send(action.prompt)}
              style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}
            >
              <Ionicons name={action.icon} size={18} color={colors.primary} />
              <Text style={styles.quickActionText}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.composer}>
        <TextInput
          accessibilityLabel="Ask Nova"
          value={input}
          onChangeText={setInput}
          placeholder="Ask about this technique…"
          placeholderTextColor={colors.muted}
          style={styles.input}
          multiline
          maxLength={300}
          onSubmitEditing={() => void send(input)}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityState={{ disabled: !input.trim() || loading }}
          disabled={!input.trim() || loading}
          onPress={() => void send(input)}
          style={({ pressed }) => [styles.sendButton, (!input.trim() || loading) && styles.sendDisabled, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-up" size={21} color={colors.white} />
        </Pressable>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 },
  emptyPage: { justifyContent: 'center', minHeight: '100%' },
  coachHeader: { paddingTop: spacing.xl, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  coachIdentity: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  coachCopy: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  coachName: { ...typography.heading, color: colors.white },
  onlineDot: { width: 8, height: 8, borderRadius: radius.pill, backgroundColor: colors.cyan },
  coachCaption: { ...typography.caption, color: '#CFC7E9' },
  messages: { flex: 1, backgroundColor: colors.canvas },
  messageContent: { padding: spacing.lg, gap: spacing.md },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, maxWidth: '88%' },
  messageRowLearner: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  bubble: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg },
  coachBubble: { backgroundColor: colors.surface, borderBottomLeftRadius: radius.sm, borderWidth: 1, borderColor: colors.border },
  learnerBubble: { backgroundColor: colors.primary, borderBottomRightRadius: radius.sm },
  messageText: { ...typography.body, color: colors.inkSoft },
  learnerText: { color: colors.white },
  typingBubble: { flexDirection: 'row', gap: 5, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg, backgroundColor: colors.surface },
  typingDot: { width: 7, height: 7, borderRadius: radius.pill, backgroundColor: colors.primarySoft },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.dangerSoft },
  errorText: { ...typography.caption, color: colors.danger, flex: 1 },
  quickLabel: { ...typography.caption, color: colors.muted, fontWeight: '700', letterSpacing: 0.6, marginTop: spacing.xs },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  quickAction: { flexGrow: 1, flexBasis: '46%', flexDirection: 'row', alignItems: 'center', gap: spacing.xs, minHeight: 46, paddingHorizontal: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.primarySoft, backgroundColor: colors.surface },
  quickActionText: { ...typography.label, color: colors.primaryDark, fontSize: 13 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, maxHeight: 100, minHeight: 46, borderRadius: radius.lg, backgroundColor: colors.canvas, color: colors.ink, paddingHorizontal: spacing.md, paddingTop: 12, paddingBottom: 12, ...typography.body },
  sendButton: { width: 46, height: 46, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  sendDisabled: { opacity: 0.42 },
  pressed: { opacity: 0.75 },
});
