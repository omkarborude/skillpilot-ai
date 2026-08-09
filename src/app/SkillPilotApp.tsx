import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomTabs } from '../components/ui';
import { AICoachScreen } from '../screens/AICoachScreen';
import { AIPlanScreen } from '../screens/AIPlanScreen';
import { CreateGoalScreen } from '../screens/CreateGoalScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { LearningPlanScreen } from '../screens/LearningPlanScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { TechniqueDetailScreen } from '../screens/TechniqueDetailScreen';
import { useSkillPilotState } from '../state/useSkillPilotState';
import type { ScreenName } from '../types/learning';
import { calculateProgress } from '../utils/progress';
import { colors, spacing } from './theme';

export function SkillPilotApp() {
  const learning = useSkillPilotState();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('createGoal');
  const progress = calculateProgress(
    learning.state.completedTechniqueIds.length,
    learning.techniques.length,
  );
  const sharedProps = { ...learning, currentScreen, go: setCurrentScreen, progress };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        <Text style={styles.logo}>✦ SkillPilot AI</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {currentScreen === 'createGoal' ? <CreateGoalScreen {...sharedProps} /> : null}
        {currentScreen === 'aiPlan' ? <AIPlanScreen {...sharedProps} /> : null}
        {currentScreen === 'dashboard' ? <DashboardScreen {...sharedProps} /> : null}
        {currentScreen === 'plan' ? <LearningPlanScreen {...sharedProps} /> : null}
        {currentScreen === 'technique' ? <TechniqueDetailScreen {...sharedProps} /> : null}
        {currentScreen === 'practice' ? <PracticeScreen {...sharedProps} /> : null}
        {currentScreen === 'coach' ? <AICoachScreen {...sharedProps} /> : null}
        {currentScreen === 'progress' ? <ProgressScreen {...sharedProps} /> : null}
        {currentScreen === 'profile' ? <ProfileScreen {...sharedProps} /> : null}
      </ScrollView>
      {currentScreen !== 'createGoal' && currentScreen !== 'aiPlan' ? (
        <BottomTabs current={currentScreen} onSelect={setCurrentScreen} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  logo: { color: colors.text, fontWeight: '900', fontSize: 17 },
  content: { padding: spacing.lg, paddingBottom: 118 },
});
