import { Platform, TextStyle, ViewStyle } from 'react-native';

export const colors = {
  ink: '#19152C',
  inkSoft: '#4F4967',
  muted: '#77718D',
  canvas: '#F8F7FC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1EEFF',
  border: '#E8E4F2',
  primary: '#6338F0',
  primaryDark: '#3B1D9F',
  primarySoft: '#E9E2FF',
  night: '#17103D',
  nightSoft: '#29205D',
  success: '#17A673',
  successSoft: '#E2F7EF',
  warning: '#F4A62A',
  warningSoft: '#FFF3DD',
  danger: '#E35D6A',
  dangerSoft: '#FDEBED',
  coral: '#FF796B',
  cyan: '#21C8C3',
  white: '#FFFFFF',
  overlay: 'rgba(23, 16, 61, 0.56)',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '800' } satisfies TextStyle,
  title: { fontSize: 26, lineHeight: 32, fontWeight: '800' } satisfies TextStyle,
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '700' } satisfies TextStyle,
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' } satisfies TextStyle,
  label: { fontSize: 13, lineHeight: 18, fontWeight: '700' } satisfies TextStyle,
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '500' } satisfies TextStyle,
} as const;

export const shadows = {
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.night,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
    },
    android: { elevation: 3 },
    web: { boxShadow: '0 12px 32px rgba(30, 20, 70, 0.08)' } as ViewStyle,
    default: {},
  }),
} as const;

export const layout = {
  maxContentWidth: 760,
  horizontalPadding: 20,
  tabBarHeight: 72,
} as const;
