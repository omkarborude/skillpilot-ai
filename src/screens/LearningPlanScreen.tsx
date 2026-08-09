import { Pressable, Text, View } from 'react-native';
import { ProgressBar, ScreenStack, StatusDot, styles } from '../components/ui';
import type { ScreenProps } from './screenTypes';

export function LearningPlanScreen({ techniques, progress, selectTechnique, go }: ScreenProps) {
  return (
    <ScreenStack>
      <Text style={localStyles.eyebrow}>Learning Plan</Text>
      <Text style={localStyles.title}>Your focused path</Text>
      <ProgressBar value={progress} />
      {techniques.map((technique, index) => (
        <Pressable key={technique.id} accessibilityRole="button" style={localStyles.techniqueRow} onPress={() => { selectTechnique(technique.id); go('technique'); }}>
          <StatusDot status={technique.status} label={technique.status === 'completed' ? '✓' : index + 1} />
          <View style={localStyles.flex}>
            <Text style={styles.cardHeadline}>{technique.title}</Text>
            <Text style={styles.muted}>{technique.difficulty} · {technique.estimatedMinutes} min</Text>
            <Text style={styles.muted}>Why: {technique.reason}</Text>
          </View>
          <Text style={styles.statusText}>{technique.status}</Text>
        </Pressable>
      ))}
    </ScreenStack>
  );
}

const localStyles = {
  eyebrow: { color: '#6C5CE7', fontSize: 12, fontWeight: '900' as const, letterSpacing: 1.4, textTransform: 'uppercase' as const },
  title: { color: '#111827', fontSize: 42, lineHeight: 44, fontWeight: '900' as const, letterSpacing: -2.2 },
  flex: { flex: 1 },
  techniqueRow: { flexDirection: 'row' as const, gap: 14, padding: 14, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'flex-start' as const },
};
