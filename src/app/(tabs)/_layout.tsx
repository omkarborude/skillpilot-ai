import { Platform, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, layout, shadows, typography } from '@/theme/tokens';

const tabIcons = {
  index: ['home', 'home-outline'],
  plan: ['map', 'map-outline'],
  coach: ['sparkles', 'sparkles-outline'],
  progress: ['stats-chart', 'stats-chart-outline'],
  profile: ['person', 'person-outline'],
} as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        tabBarIcon: ({ color, focused, size }) => {
          const icons = tabIcons[route.name as keyof typeof tabIcons] ?? tabIcons.index;
          return <Ionicons name={focused ? icons[0] : icons[1]} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="plan" options={{ title: 'Plan' }} />
      <Tabs.Screen name="coach" options={{ title: 'Coach' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const webBar = Platform.OS === 'web'
  ? { width: '100%' as const, maxWidth: layout.maxContentWidth, alignSelf: 'center' as const }
  : {};

const styles = StyleSheet.create({
  tabBar: {
    ...webBar,
    height: layout.tabBarHeight,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  tabItem: { borderRadius: 14 },
  label: { ...typography.caption, fontSize: 11, fontWeight: '700' },
});
