import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme/tokens';
import { RobotMascot } from './RobotMascot';
import { Button, Card } from './ui';

export function EmptyJourney() {
  const router = useRouter();
  return (
    <Card style={styles.card}>
      <RobotMascot size="large" />
      <View style={styles.copy}>
        <Text style={styles.title}>Your focused plan starts here</Text>
        <Text style={styles.caption}>Create one goal and Nova will turn it into 5–8 techniques.</Text>
      </View>
      <Button label="Create learning plan" onPress={() => router.replace('/')} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: spacing.lg, padding: spacing.xl },
  copy: { alignItems: 'center', gap: spacing.xs },
  title: { ...typography.heading, color: colors.ink, textAlign: 'center' },
  caption: { ...typography.body, color: colors.muted, textAlign: 'center' },
});
