import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Page } from '@/components/Page';
import { RobotMascot } from '@/components/RobotMascot';
import { Button, Card, Pill, TextField } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export default function LoginScreen() {
  const router = useRouter();
  const savedPhoneNumber = useAuthStore((state) => state.phoneNumber);
  const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);
  const [phone, setPhone] = useState(savedPhoneNumber);
  const [error, setError] = useState('');

  const continueToOtp = () => {
    const normalizedPhone = phone.replace(/\D/g, '');
    if (!normalizedPhone) {
      setError('Enter your phone number to continue.');
      return;
    }
    setError('');
    setPhoneNumber(normalizedPhone);
    router.push('/otp' as Href);
  };

  return (
    <Page keyboardAware contentStyle={styles.page}>
      <LinearGradient colors={[colors.night, '#312078']} style={styles.hero}>
        <View style={styles.heroTopRow}>
          <Pill tone="green">DEMO • ON-DEVICE DATA</Pill>
          <RobotMascot size="small" />
        </View>
        <Text style={styles.heroTitle}>Welcome to SkillPilot.</Text>
        <Text style={styles.heroCaption}>
          This demo keeps one learning journey on this device.
        </Text>
      </LinearGradient>

      <Card style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="phone-portrait-outline" size={26} color={colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>Enter a demo phone number</Text>
          <Text style={styles.caption}>Any phone number works. It is used only as a local label.</Text>
        </View>
        <TextField
          label="Phone number"
          value={phone}
          onChangeText={setPhone}
          placeholder="9876543210"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          maxLength={15}
          error={error}
          returnKeyType="done"
          onSubmitEditing={continueToOtp}
        />
        <Button label="Continue" icon="arrow-forward" onPress={continueToOtp} />
        <View style={styles.demoNote}>
          <Ionicons name="information-circle-outline" size={18} color={colors.muted} />
          <Text style={styles.demoText}>No SMS is sent, and this does not create a real account.</Text>
        </View>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { minHeight: '100%', justifyContent: 'center', gap: spacing.xl },
  hero: { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm, overflow: 'hidden' },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroTitle: { ...typography.title, color: colors.white },
  heroCaption: { ...typography.body, color: '#D4CCEF' },
  card: { gap: spacing.lg, padding: spacing.lg },
  iconWrap: { width: 52, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  copy: { gap: spacing.xxs },
  title: { ...typography.heading, color: colors.ink },
  caption: { ...typography.body, color: colors.muted },
  demoNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  demoText: { ...typography.caption, color: colors.muted, flex: 1 },
});
