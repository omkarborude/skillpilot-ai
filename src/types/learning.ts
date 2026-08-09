export type ScreenName = 'createGoal' | 'aiPlan' | 'dashboard' | 'plan' | 'technique' | 'practice' | 'coach' | 'progress' | 'profile';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type TechniqueStatus = 'locked' | 'available' | 'completed' | 'skipped';
export type ResourceType = 'video' | 'reading';

export interface LearningGoal {
  hobby: string;
  goal: string;
  level: SkillLevel;
  dailyMinutes: number;
}

export interface LearningResource {
  id: string;
  title: string;
  type: ResourceType;
  durationMinutes: number;
  source: string;
}

export interface Technique {
  id: string;
  title: string;
  description: string;
  difficulty: SkillLevel;
  estimatedMinutes: number;
  reason: string;
  status: TechniqueStatus;
  checklist: string[];
  resources: LearningResource[];
}

export interface LearningPlan {
  id: string;
  title: string;
  summary: string;
  techniques: Technique[];
}

export interface PracticeSession {
  id: string;
  techniqueId: string;
  minutes: number;
  notes: string;
  completedAt: string;
}

export interface AppState {
  goal: LearningGoal;
  plan: LearningPlan;
  selectedTechniqueId: string;
  completedTechniqueIds: string[];
  skippedTechniqueIds: string[];
  notesByTechniqueId: Record<string, string>;
  practiceHistory: PracticeSession[];
  streak: number;
}
