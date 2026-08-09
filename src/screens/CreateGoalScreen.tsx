import { useState } from 'react';
import { Text, View } from 'react-native';
import { Card, Field, Pill, PrimaryButton, ScreenStack, styles } from '../components/ui';
import type { SkillLevel } from '../types/learning';
import type { ScreenProps } from './screenTypes';

const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];
const times = [10, 20, 30, 45];

export function CreateGoalScreen({ state, setGoal, go }: ScreenProps) {
  const [hobby, setHobby] = useState(state.goal.hobby);
  const [goal, setGoalText] = useState(state.goal.goal);
  const [level, setLevel] = useState<SkillLevel>(state.goal.level);
  const [dailyMinutes, setDailyMinutes] = useState(state.goal.dailyMinutes);

  return (
    <ScreenStack>
      <Text style={localStyles.eyebrow}>Create Goal</Text>
      <Text style={localStyles.title}>What do you want to get better at?</Text>
      <Card title="One focused path" subtitle="No separate onboarding maze. Tell SkillPilot what matters and get a realistic plan.">
        <Field label="Hobby" value={hobby} onChangeText={setHobby} />
        <Field label="Goal" value={goal} onChangeText={setGoalText} multiline />
        <Text style={styles.label}>Your level</Text>
        <View style={styles.choiceRow}>{levels.map((item) => <Pill key={item} label={item} selected={item === level} onPress={() => setLevel(item)} />)}</View>
        <Text style={styles.label}>Time available</Text>
        <View style={styles.choiceRow}>{times.map((item) => <Pill key={item} label={item === 45 ? '45+ min' : `${item} min`} selected={item === dailyMinutes} onPress={() => setDailyMinutes(item)} />)}</View>
        <PrimaryButton label="Create my learning plan" onPress={() => { setGoal({ hobby, goal, level, dailyMinutes }); go('aiPlan'); }} />
      </Card>
    </ScreenStack>
  );
}

const localStyles = {
  eyebrow: { color: '#6C5CE7', fontSize: 12, fontWeight: '900' as const, letterSpacing: 1.4, textTransform: 'uppercase' as const },
  title: { color: '#111827', fontSize: 42, lineHeight: 44, fontWeight: '900' as const, letterSpacing: -2.2 },
};
