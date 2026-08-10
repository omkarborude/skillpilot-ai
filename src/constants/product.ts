import { GoalReason, HobbyId, SkillLevel } from '@/types/learning';

export const hobbyOptions: { id: HobbyId; label: string; icon: string }[] = [
  { id: 'guitar', label: 'Guitar', icon: '🎸' },
  { id: 'chess', label: 'Chess', icon: '♟️' },
  { id: 'photography', label: 'Photography', icon: '📷' },
  { id: 'drawing', label: 'Drawing', icon: '✏️' },
  { id: 'custom', label: 'Something else', icon: '✨' },
];

export const goalOptions: { id: GoalReason; title: string; caption: string }[] = [
  { id: 'fun', title: 'Learn for fun', caption: 'Enjoy steady progress without pressure' },
  { id: 'confidence', title: 'Become confident', caption: 'Build a dependable core skill set' },
  { id: 'perform', title: 'Perform or compete', caption: 'Work toward a concrete milestone' },
  { id: 'create', title: 'Create something', caption: 'Finish a meaningful personal project' },
];

export const levelOptions: { id: SkillLevel; title: string; caption: string }[] = [
  { id: 'beginner', title: 'Complete beginner', caption: 'Starting from the basics' },
  { id: 'some_experience', title: 'Some experience', caption: 'I know a few fundamentals' },
  { id: 'intermediate', title: 'Intermediate', caption: 'I want a focused next level' },
];

export const dailyMinuteOptions = [15, 20, 30, 45] as const;
