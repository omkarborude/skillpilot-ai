import type {
  CoachRequest,
  LearnerGoal,
  PlanDraft,
  ReplaceTechniqueRequest,
  TechniqueDraft,
} from '../contracts.js';
import { normalizePlanDraft, normalizeReplacement } from '../domain/normalizers.js';
import type { LearningProvider } from '../providers/learning-provider.js';

const resourceCopy = {
  video: { title: 'Visual guide', durationLabel: '6 min', description: 'See the movement or setup before practicing it.' },
  audio: { title: 'Listening guide', durationLabel: '3 min', description: 'Hear the target rhythm or sound at two useful speeds.' },
  article: { title: 'Concept guide', durationLabel: '5 min read', description: 'Review the principle through a concise explanation.' },
  practice: { title: 'Guided practice', durationLabel: '10 min', description: 'Apply the technique and capture one observation.' },
} as const;

function createPlanDraft(goal: LearnerGoal): PlanDraft {
  const hobbyName = goal.customHobby ?? goal.hobbyName;
  return {
    title: `${hobbyName} foundations`,
    outcome: `Build confidence through a focused ${hobbyName.toLowerCase()} practice sequence.`,
    totalWeeks: 4,
    techniques: Array.from({ length: 5 }, (_, index) => ({
      title: `${hobbyName} technique ${index + 1}`,
      shortTitle: `Technique ${index + 1}`,
      description: `A focused step for improving ${hobbyName.toLowerCase()} through deliberate practice.`,
      whyItMatters: 'This step builds a reusable foundation for the next technique in the sequence.',
      minutes: Math.min(goal.dailyMinutes, 20),
      resources: [
        { type: goal.hobbyId === 'chess' ? 'article' as const : 'video' as const, ...resourceCopy[goal.hobbyId === 'chess' ? 'article' : 'video'] },
        { type: 'practice' as const, ...resourceCopy.practice },
      ],
      practiceTasks: ['Review the core cue', 'Complete five careful repetitions'],
      keyPoints: ['Work slowly first', 'Check one result at a time'],
    })),
  };
}

export class FixtureLearningProvider implements LearningProvider {
  readonly name = 'gemini' as const;

  async generatePlan(goal: LearnerGoal) {
    return normalizePlanDraft(goal, createPlanDraft(goal));
  }

  async replaceTechnique(input: ReplaceTechniqueRequest) {
    const { technique, mode } = input;
    const goal = input.goal ?? {
      hobbyId: 'custom' as const,
      hobbyName: 'Test hobby',
      customHobby: 'Test hobby',
      reason: 'fun' as const,
      level: 'beginner' as const,
      dailyMinutes: Math.max(10, technique.minutes),
    };
    const draft: TechniqueDraft = {
      title: mode === 'shorter' ? `Short ${technique.shortTitle}` : `Adjusted ${technique.shortTitle}`,
      shortTitle: technique.shortTitle,
      description: `A ${mode} route that preserves the original learning outcome.`,
      whyItMatters: technique.whyItMatters,
      minutes: mode === 'shorter' ? Math.min(8, technique.minutes) : technique.minutes,
      resources: technique.resources.slice(0, mode === 'shorter' ? 1 : 3).map(({ id: _id, ...resource }) => resource),
      practiceTasks: technique.practiceTasks.map(({ label }) => label).slice(0, mode === 'shorter' ? 2 : 4),
      keyPoints: technique.keyPoints,
    };
    return normalizeReplacement(goal, technique, draft);
  }

  async answerCoach(input: CoachRequest) {
    return `Try ${input.goal?.hobbyName ?? 'this technique'} at half speed and check one cue before repeating.`;
  }
}
