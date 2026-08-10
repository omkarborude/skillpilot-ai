export type HobbyId = 'guitar' | 'chess' | 'photography' | 'drawing' | 'custom';
export type SkillLevel = 'beginner' | 'some_experience' | 'intermediate';
export type GoalReason = 'fun' | 'confidence' | 'perform' | 'create';

export type LearnerGoal = {
  hobbyId: HobbyId;
  hobbyName: string;
  customHobby?: string;
  reason: GoalReason;
  level: SkillLevel;
  dailyMinutes: number;
};

export type TechniqueStatus = 'completed' | 'in_progress' | 'locked' | 'skipped';
export type ResourceType = 'video' | 'audio' | 'article' | 'practice';

export type LearningResource = {
  id: string;
  title: string;
  type: ResourceType;
  durationLabel: string;
  description: string;
  url?: string;
};

export type PracticeTask = {
  id: string;
  label: string;
};

export type Technique = {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  whyItMatters: string;
  minutes: number;
  status: TechniqueStatus;
  resources: LearningResource[];
  practiceTasks: PracticeTask[];
  keyPoints: string[];
  replaced?: boolean;
};

export type LearningPlan = {
  id: string;
  hobbyId: HobbyId;
  title: string;
  outcome: string;
  totalWeeks: number;
  techniques: Technique[];
};

export type CoachRole = 'learner' | 'coach';

export type CoachMessage = {
  id: string;
  role: CoachRole;
  content: string;
  createdAt: number;
};

export type PracticeSession = {
  id: string;
  techniqueId: string;
  minutes: number;
  completedAt: number;
};

export type ReplacementMode = 'simpler' | 'shorter' | 'different';

export type Achievement = {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
};
