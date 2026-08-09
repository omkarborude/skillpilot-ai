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

export const generationSteps = [
  { title: 'Understanding your goal', caption: 'Choosing the smallest useful outcome' },
  { title: 'Selecting core techniques', caption: 'Keeping the plan focused at 5–8 steps' },
  { title: 'Matching the right media', caption: 'Video, audio, reading, or practice by skill' },
  { title: 'Balancing your daily time', caption: 'Building sessions you can realistically finish' },
] as const;
