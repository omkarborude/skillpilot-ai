import { Text, View } from 'react-native';
import { Card, Hero, Metric, Pill, PrimaryButton, ProgressBar, ScreenStack, styles } from '../components/ui';
import type { ScreenProps } from './screenTypes';

export function DashboardScreen({ state, currentTechnique, progress, go }: ScreenProps) {
  return (
    <ScreenStack>
      <Hero title={state.plan.title} eyebrow="Good evening, Omkar 👋" body={state.goal.goal}>
        <ProgressBar value={progress} />
        <Text style={styles.heroMeta}>{progress}% complete</Text>
      </Hero>
      <Card title="Today's mission" subtitle={currentTechnique.reason}>
        <View style={localStyles.splitRow}>
          <Text style={styles.cardHeadline}>{currentTechnique.title}</Text>
          <Pill label={`${state.goal.dailyMinutes} min`} selected />
        </View>
        <PrimaryButton label="Continue" onPress={() => go('technique')} />
      </Card>
      <Card title="AI Insight" subtitle="You've been consistent this week. Focus on chord transitions today before moving to rhythm." />
      <View style={localStyles.twoColumn}>
        <Metric label="day streak" value={String(state.streak)} />
        <Metric label="next resource" value={currentTechnique.resources[0]?.title ?? 'Ready'} small />
      </View>
    </ScreenStack>
  );
}

const localStyles = {
  splitRow: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, gap: 10 },
  twoColumn: { flexDirection: 'row' as const, gap: 14 },
};
