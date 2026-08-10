type AuthNavigationState = {
  hydrated: boolean;
  isAuthenticated: boolean;
  hasStartedLearning: boolean;
  phoneNumber: string;
  rootSegment?: string;
};

export type AuthRedirect = '/login' | '/onboarding' | '/(tabs)' | null;

export function getAuthRedirect({
  hydrated,
  isAuthenticated,
  hasStartedLearning,
  phoneNumber,
  rootSegment,
}: AuthNavigationState): AuthRedirect {
  if (!hydrated) return null;

  const isRootRoute = rootSegment === undefined;
  const isLoginRoute = rootSegment === 'login';
  const isOtpRoute = rootSegment === 'otp';
  const isAuthRoute = isLoginRoute || isOtpRoute;
  const isOnboardingRoute = rootSegment === 'onboarding' || rootSegment === 'generating';
  const isProtectedLearningRoute =
    rootSegment === '(tabs)' || rootSegment === 'technique' || rootSegment === 'practice';

  if (!isAuthenticated) {
    if (isLoginRoute || (isOtpRoute && Boolean(phoneNumber))) return null;
    return '/login';
  }

  if (hasStartedLearning && (isRootRoute || isAuthRoute || isOnboardingRoute)) {
    return '/(tabs)';
  }

  if (!hasStartedLearning && (isRootRoute || isAuthRoute || isProtectedLearningRoute)) {
    return '/onboarding';
  }

  return null;
}
