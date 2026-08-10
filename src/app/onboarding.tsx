import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Page } from '@/components/Page';
import { RobotMascot } from '@/components/RobotMascot';
import { Button, Card, Pill, SectionHeading, SelectionCard, TextField } from '@/components/ui';
import { dailyMinuteOptions, goalOptions, hobbyOptions, levelOptions } from '@/constants/product';
import { useJourneyStore } from '@/store/journeyStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { GoalReason, HobbyId, LearnerGoal, SkillLevel } from '@/types/learning';

export default function OnboardingScreen() {
  const router = useRouter();
  const currentPlan = useJourneyStore((state) => state.plan);
  const setGoal = useJourneyStore((state) => state.setGoal);
  const [hobbyId, setHobbyId] = useState<HobbyId>('guitar');
  const [customHobby, setCustomHobby] = useState('');
  const [reason, setReason] = useState<GoalReason>('confidence');
  const [level, setLevel] = useState<SkillLevel>('beginner');
  const [dailyMinutes, setDailyMinutes] = useState<number>(20);
  const [error, setError] = useState('');

  const selectedHobby = useMemo(
    () => hobbyOptions.find((option) => option.id === hobbyId),
    [hobbyId],
  );

  const buildGoal = (): LearnerGoal | null => {
    const normalizedCustomHobby = customHobby.trim();
    if (hobbyId === 'custom' && normalizedCustomHobby.length < 2) {
      setError('Tell us which hobby you want to learn.');
      return null;
    }
    setError('');
    return {
      hobbyId,
      hobbyName: hobbyId === 'custom' ? normalizedCustomHobby : (selectedHobby?.label ?? 'Guitar'),
      customHobby: hobbyId === 'custom' ? normalizedCustomHobby : undefined,
      reason,
      level,
      dailyMinutes,
    };
  };

  const handleCreatePlan = () => {
    const goal = buildGoal();
    if (!goal) return;
    setGoal(goal);
    router.push('/generating');
  };

  return (
    <Page contentStyle={styles.page}>
      <LinearGradient colors={[colors.night, '#2E176E']} style={styles.hero}>
        <View style={styles.heroTopRow}>
          <Pill tone="green">PERSONAL • FOCUSED • PRACTICAL</Pill>
          <RobotMascot size="small" />
        </View>
        <Text style={styles.heroTitle}>Learn the right few things—not everything.</Text>
        <Text style={styles.heroCaption}>
          Nova turns one hobby goal into a realistic 5–8 technique plan you can finish.
        </Text>
      </LinearGradient>

      {currentPlan ? (
        <Card style={styles.continueCard}>
          <View style={styles.continueIcon}>
            <Ionicons name="play" size={18} color={colors.primary} />
          </View>
          <View style={styles.continueCopy}>
            <Text style={styles.continueEyebrow}>Journey in progress</Text>
            <Text style={styles.continueTitle}>{currentPlan.title}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.continueAction}>Continue</Text>
          </Pressable>
        </Card>
      ) : null}

      <SectionHeading
        eyebrow="One focused setup"
        title="What do you want to get better at?"
        caption="This replaces a long onboarding flow. You can change the plan later."
      />

      <Card style={styles.formCard}>
        <Text style={styles.groupLabel}>Choose a hobby</Text>
        <View accessibilityRole="radiogroup" style={styles.hobbyGrid}>
          {hobbyOptions.map((option) => {
            const selected = option.id === hobbyId;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setHobbyId(option.id)}
                style={({ pressed }) => [
                  styles.hobbyChip,
                  selected && styles.hobbyChipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.hobbyIcon}>{option.icon}</Text>
                <Text style={[styles.hobbyLabel, selected && styles.hobbyLabelSelected]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {hobbyId === 'custom' ? (
          <TextField
            label="Your hobby"
            value={customHobby}
            onChangeText={setCustomHobby}
            placeholder="For example, pottery"
            error={error}
            autoFocus
          />
        ) : null}

        <View style={styles.divider} />
        <Text style={styles.groupLabel}>What outcome matters most?</Text>
        <View accessibilityRole="radiogroup" style={styles.optionList}>
          {goalOptions.map((option) => (
            <SelectionCard
              key={option.id}
              title={option.title}
              caption={option.caption}
              selected={reason === option.id}
              onPress={() => setReason(option.id)}
              leading={<Ionicons name="sparkles" size={20} color={reason === option.id ? colors.primary : colors.muted} />}
            />
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.groupLabel}>Where are you starting?</Text>
        <View accessibilityRole="radiogroup" style={styles.optionList}>
          {levelOptions.map((option) => (
            <SelectionCard
              key={option.id}
              title={option.title}
              caption={option.caption}
              selected={level === option.id}
              onPress={() => setLevel(option.id)}
            />
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.groupLabel}>Daily practice time</Text>
        <View accessibilityRole="radiogroup" style={styles.timeRow}>
          {dailyMinuteOptions.map((minutes) => {
            const selected = dailyMinutes === minutes;
            return (
              <Pressable
                key={minutes}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setDailyMinutes(minutes)}
                style={({ pressed }) => [styles.timeChip, selected && styles.timeChipSelected, pressed && styles.pressed]}
              >
                <Text style={[styles.timeValue, selected && styles.timeValueSelected]}>{minutes}</Text>
                <Text style={[styles.timeUnit, selected && styles.timeValueSelected]}>min</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.recommendation}>
          <RobotMascot size="small" />
          <Text style={styles.recommendationText}>
            {dailyMinutes} minutes is enough for one focused technique and a quick reflection.
          </Text>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button label="Build my learning plan" icon="sparkles" onPress={handleCreatePlan} />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.xl },
  hero: { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm, overflow: 'hidden' },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroTitle: { ...typography.display, color: colors.white, maxWidth: 560 },
  heroCaption: { ...typography.body, color: '#D4CCEF', maxWidth: 560 },
  continueCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm },
  continueIcon: { width: 42, height: 42, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  continueCopy: { flex: 1 },
  continueEyebrow: { ...typography.caption, color: colors.muted },
  continueTitle: { ...typography.label, color: colors.ink, fontSize: 14 },
  continueAction: { ...typography.label, color: colors.primary },
  formCard: { gap: spacing.md, padding: spacing.lg },
  groupLabel: { ...typography.label, color: colors.ink, fontSize: 14 },
  hobbyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  hobbyChip: { minWidth: 112, flexGrow: 1, flexBasis: '30%', flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.sm, paddingVertical: 13, backgroundColor: colors.surface },
  hobbyChipSelected: { borderColor: colors.primary, backgroundColor: colors.surfaceAlt },
  hobbyIcon: { fontSize: 20 },
  hobbyLabel: { ...typography.label, color: colors.inkSoft },
  hobbyLabelSelected: { color: colors.primaryDark },
  optionList: { gap: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xxs },
  timeRow: { flexDirection: 'row', gap: spacing.xs },
  timeChip: { flex: 1, alignItems: 'center', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingVertical: spacing.sm },
  timeChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeValue: { ...typography.heading, color: colors.ink, fontSize: 18 },
  timeUnit: { ...typography.caption, color: colors.muted },
  timeValueSelected: { color: colors.white },
  recommendation: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderRadius: radius.md, padding: spacing.sm, backgroundColor: colors.surfaceAlt },
  recommendationText: { ...typography.caption, color: colors.inkSoft, flex: 1 },
  actions: { gap: spacing.sm },
  pressed: { opacity: 0.78 },
});
