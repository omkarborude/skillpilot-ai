export type ScreenCategory = 'Authentication' | 'Onboarding' | 'Home' | 'Roadmap' | 'AI' | 'Practice' | 'Community' | 'Profile';
export type SkillScreen = { id: string; title: string; category: ScreenCategory; description: string; cta: string; accent?: string };
export type Lesson = { id: string; title: string; minutes: number; type: 'practice' | 'watch' | 'read' | 'challenge' };
export type RoadmapNode = { id: string; title: string; progress: number; locked?: boolean };
export type AiMessage = { id: string; role: 'coach' | 'learner'; content: string };
