import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack, type Href, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RobotMascot } from '@/components/RobotMascot';
import { useStoreHydrated } from '@/hooks/useStoreHydrated';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/theme/tokens';
import { getAuthRedirect } from '@/utils/authNavigation';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrated = useStoreHydrated();
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasStartedLearning = useAuthStore((state) => state.hasStartedLearning);
  const phoneNumber = useAuthStore((state) => state.phoneNumber);

  const rootSegment = (segments as string[])[0];
  const authRedirect = getAuthRedirect({
    hydrated,
    isAuthenticated,
    hasStartedLearning,
    phoneNumber,
    rootSegment,
  });

  useEffect(() => {
    if (hydrated) void SplashScreen.hideAsync();
  }, [hydrated]);

  useEffect(() => {
    if (authRedirect) router.replace(authRedirect as Href);
  }, [authRedirect, router]);

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <RobotMascot size="large" />
        <Text style={styles.loadingText}>Preparing your learning journey…</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.fill}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.canvas },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="login" options={{ gestureEnabled: false }} />
        <Stack.Screen name="otp" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="generating" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="technique/[id]" />
        <Stack.Screen name="practice/[id]" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, backgroundColor: colors.night },
  loadingText: { ...typography.body, color: '#D8D1F4' },
});
