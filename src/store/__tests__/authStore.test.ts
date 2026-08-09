import { beforeEach, describe, expect, it } from '@jest/globals';
import { useAuthStore } from '@/store/authStore';

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      phoneNumber: '',
      isAuthenticated: false,
      hasStartedLearning: false,
    });
  });

  it('persists the demo authentication lifecycle independently from onboarding', () => {
    useAuthStore.getState().setPhoneNumber('9876543210');
    useAuthStore.getState().authenticate();

    expect(useAuthStore.getState()).toMatchObject({
      phoneNumber: '9876543210',
      isAuthenticated: true,
      hasStartedLearning: false,
    });

    useAuthStore.getState().completeOnboarding();
    useAuthStore.getState().logout();

    expect(useAuthStore.getState()).toMatchObject({
      isAuthenticated: false,
      hasStartedLearning: true,
    });
  });

  it('allows an explicit new-goal action to reopen onboarding', () => {
    useAuthStore.getState().completeOnboarding();
    useAuthStore.getState().restartOnboarding();

    expect(useAuthStore.getState().hasStartedLearning).toBe(false);
  });
});
