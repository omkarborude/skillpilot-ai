import { Text } from 'react-native';
import { Card, InfoRow, PrimaryButton, ScreenStack } from '../components/ui';
import type { ScreenProps } from './screenTypes';

export function ProfileScreen({ state, reset }: ScreenProps) {
  return (
    <ScreenStack>
      <Card title="Profile" subtitle="Intentionally small settings for the current journey.">
        <Text style={localStyles.avatar}>OB</Text>
        <InfoRow label="Name" value="Omkar Borude" />
        <InfoRow label="Current hobby" value={state.goal.hobby} />
        <InfoRow label="Current goal" value={state.goal.goal} />
        <InfoRow label="Skill level" value={state.goal.level} />
        <InfoRow label="Daily practice target" value={`${state.goal.dailyMinutes} minutes`} />
        <PrimaryButton muted label="Reset learning plan" onPress={reset} />
      </Card>
    </ScreenStack>
  );
}

const localStyles = {
  avatar: { width: 74, height: 74, overflow: 'hidden' as const, borderRadius: 28, backgroundColor: '#6C5CE7', color: '#FFFFFF', textAlign: 'center' as const, lineHeight: 74, fontSize: 24, fontWeight: '900' as const },
};
