import { Text, View } from 'react-native';
import { Card, Hero, Metric, ProgressBar, ScreenStack, styles } from '../components/ui';
import type { ScreenProps } from './screenTypes';

const week = ['Mon ✓', 'Tue ✓', 'Wed -', 'Thu ✓', 'Fri ✓', 'Sat -', 'Sun -'];

export function ProgressScreen({ state, progress, techniques }: ScreenProps) {
  const totalMinutes = state.practiceHistory.reduce((sum, session) => sum + session.minutes, 0);
  return (
    <ScreenStack>
      <Hero title={`${progress}%`} eyebrow="Overall Progress" body="Progress is obvious, focused, and actionable."><ProgressBar value={progress} /></Hero>
      <View style={localStyles.twoColumn}>
        <Metric label="techniques" value={`${state.completedTechniqueIds.length}/${techniques.length}`} />
        <Metric label="practice" value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`} />
      </View>
      <Metric label="consistency" value="82%" />
      <Card title="This Week"><View style={localStyles.weekRow}>{week.map((day) => <Text key={day} style={localStyles.weekPill}>{day}</Text>)}</View></Card>
      <Card title="AI Insight" subtitle="You're practicing consistently. The next improvement will come from shorter but more frequent sessions." />
      <Card title="Achievements" subtitle="7 Day Streak · First Chord · Consistent Learner" />
    </ScreenStack>
  );
}

const localStyles = {
  twoColumn: { flexDirection: 'row' as const, gap: 14 },
  weekRow: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 10 },
  weekPill: { color: '#111827', fontWeight: '800' as const, padding: 10, borderRadius: 14, backgroundColor: '#F2F3F8' },
};
