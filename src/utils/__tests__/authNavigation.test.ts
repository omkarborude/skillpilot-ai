import { describe, expect, it } from '@jest/globals';
import { getAuthRedirect } from '@/utils/authNavigation';

const authenticatedState = {
  hydrated: true,
  isAuthenticated: true,
  hasStartedLearning: true,
  phoneNumber: '9999999999',
};

describe('getAuthRedirect', () => {
  it('blocks direct OTP access without a stored phone number', () => {
    expect(getAuthRedirect({
      hydrated: true,
      isAuthenticated: false,
      hasStartedLearning: false,
      phoneNumber: '',
      rootSegment: 'otp',
    })).toBe('/login');
  });

  it('allows OTP access for a stored dummy phone number', () => {
    expect(getAuthRedirect({
      hydrated: true,
      isAuthenticated: false,
      hasStartedLearning: false,
      phoneNumber: '9999999999',
      rootSegment: 'otp',
    })).toBeNull();
  });

  it('routes an authenticated learner from the root to the dashboard', () => {
    expect(getAuthRedirect({ ...authenticatedState, rootSegment: undefined })).toBe('/(tabs)');
  });

  it('routes an authenticated new learner from the root to onboarding', () => {
    expect(getAuthRedirect({
      ...authenticatedState,
      hasStartedLearning: false,
      rootSegment: undefined,
    })).toBe('/onboarding');
  });
});
