import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, type Href, useRouter } from 'expo-router';
import { Page } from '@/components/Page';
import { RobotMascot } from '@/components/RobotMascot';
import { Button, Card, Pill, TextField } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useJourneyStore } from '@/store/journeyStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export default function OtpScreen() {
  const router = useRouter();
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const authenticate = useAuthStore((state) => state.authenticate);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const verifyOtp = () => {
    if (!useAuthStore.getState().phoneNumber) {
      router.replace('/login');
      return;
    }

    const normalizedOtp = otp.replace(/\D/g, '');
    if (!normalizedOtp) {
      setError('Enter your verification code to continue.');
      return;
    }

    setError('');
    const hasExistingJourney = Boolean(useJourneyStore.getState().plan);
    authenticate();
    if (hasExistingJourney) completeOnboarding();
    router.replace(hasExistingJourney ? '/(tabs)' : ('/onboarding' as Href));
  };

  if (!phoneNumber) {
    return <Redirect href="/login" />;
  }

  return (
    <Page keyboardAware contentStyle={styles.page}>
      <View style={styles.mascotWrap}>
        <RobotMascot size="large" />
        <Pill>DEMO ACCESS</Pill>
      </View>

      <Card style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="shield-checkmark-outline" size={28} color={colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>Enter a demo code</Text>
          <Text style={styles.caption}>
            No SMS is sent. Enter any numeric code for ••••{phoneNumber.slice(-4)}.
          </Text>
        </View>
        <TextField
          label="Demo access code"
          value={otp}
          onChangeText={setOtp}
          placeholder="1234"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={6}
          error={error}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={verifyOtp}
        />
        <Button label="Continue" icon="checkmark-circle" onPress={verifyOtp} />
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.editButton}>
          <Ionicons name="arrow-back" size={17} color={colors.primary} />
          <Text style={styles.editText}>Change demo number</Text>
        </Pressable>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { minHeight: '100%', justifyContent: 'center', gap: spacing.xl },
  mascotWrap: { alignItems: 'center', gap: spacing.sm },
  card: { gap: spacing.lg, padding: spacing.lg },
  iconWrap: { width: 54, height: 54, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  copy: { gap: spacing.xxs },
  title: { ...typography.heading, color: colors.ink },
  caption: { ...typography.body, color: colors.muted },
  editButton: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  editText: { ...typography.label, color: colors.primary },
});
