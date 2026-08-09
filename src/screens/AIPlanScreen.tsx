import { Text, View } from 'react-native';
import { aiSteps } from '../data/seed';
import { Card, Pill, PrimaryButton, ScreenStack, styles } from '../components/ui';
import type { ScreenProps } from './screenTypes';

export function AIPlanScreen({ state, go }: ScreenProps) {
  return (
    <ScreenStack>
      <Text style={localStyles.title}>Building your learning path</Text>
      <Card subtitle="Your plan will contain only the skills that matter for your goal.">
        {aiSteps.map((step, index) => (
          <View key={step} style={localStyles.stepRow}>
            <Text style={localStyles.check}>{index < 3 ? '✓' : '•'}</Text>
            <Text style={localStyles.stepText}>{step}</Text>
          </View>
        ))}
        <View style={styles.choiceRow}>
          <Pill label="6 techniques" selected />
          <Pill label={`${state.goal.dailyMinutes} min/day`} selected />
          <Pill label={`${state.goal.level} friendly`} selected />
        </View>
        <PrimaryButton label="Start Learning" onPress={() => go('dashboard')} />
      </Card>
    </ScreenStack>
  );
}

const localStyles = {
  title: { color: '#111827', fontSize: 42, lineHeight: 44, fontWeight: '900' as const, letterSpacing: -2.2 },
  stepRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, minHeight: 34 },
  check: { color: '#22C55E', fontSize: 18, fontWeight: '900' as const },
  stepText: { color: '#111827', fontWeight: '800' as const },
};
