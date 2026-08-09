import type {
  CoachRequest,
  LearnerGoal,
  PlanDraft,
  ReplaceTechniqueRequest,
  TechniqueDraft,
} from '../contracts.js';
import { blueprintCatalog, type HobbyBlueprint } from '../data/blueprints.js';
import { normalizePlanDraft, normalizeReplacement } from '../domain/normalizers.js';
import type { LearningProvider } from './learning-provider.js';

const resourceCopy = {
  video: {
    title: 'Focused visual demonstration',
    durationLabel: '6 min',
    description: 'See the movement or setup from useful angles before practicing it.',
  },
  audio: {
    title: 'Listen and match the example',
    durationLabel: '3 min',
    description: 'Hear the target rhythm or sound at practice speed and normal speed.',
  },
  article: {
    title: 'Concise concept guide',
    durationLabel: '5 min read',
    description: 'Understand the principle through a short explanation and clear examples.',
  },
  practice: {
    title: 'Guided mini-practice',
    durationLabel: '10 min',
    description: 'Apply the technique immediately and capture one useful observation.',
  },
} as const;

function blueprintToDraft(blueprint: HobbyBlueprint, hobbyName: string): PlanDraft {
  return {
    title: blueprint.title.replace('Hobby', hobbyName),
    outcome: blueprint.outcome.replace('hobby', hobbyName.toLowerCase()),
    totalWeeks: blueprint.totalWeeks,
    techniques: blueprint.techniques.map((technique) => ({
      title: technique.title,
      shortTitle: technique.shortTitle,
      description: technique.description,
      whyItMatters: technique.whyItMatters,
      minutes: technique.minutes,
      resources: technique.resourceTypes.map((type) => ({ type, ...resourceCopy[type] })),
      practiceTasks: technique.practiceTasks,
      keyPoints: technique.keyPoints,
    })),
  };
}

function goalForReplacement(input: ReplaceTechniqueRequest): LearnerGoal {
  return (
    input.goal ?? {
      hobbyId: 'custom',
      hobbyName: 'Your hobby',
      customHobby: 'Your hobby',
      reason: 'fun',
      level: 'beginner',
      dailyMinutes: Math.max(10, input.technique.minutes),
    }
  );
}

export class MockLearningProvider implements LearningProvider {
  readonly name = 'mock' as const;

  async generatePlan(goal: LearnerGoal) {
    const blueprint = blueprintCatalog[goal.hobbyId];
    return normalizePlanDraft(goal, blueprintToDraft(blueprint, goal.customHobby ?? goal.hobbyName));
  }

  async replaceTechnique(input: ReplaceTechniqueRequest) {
    const { technique, mode } = input;
    const modeCopy = {
      simpler: {
        title: `Foundation version: ${technique.shortTitle}`,
        description: `A simpler path to ${technique.description.toLowerCase()}`,
      },
      shorter: {
        title: `Eight-minute ${technique.shortTitle.toLowerCase()}`,
        description: 'A compact version that keeps only the highest-impact action.',
      },
      different: {
        title: `A different route to ${technique.shortTitle.toLowerCase()}`,
        description: 'Reach the same outcome through a new explanation and practice pattern.',
      },
    }[mode];

    const draft: TechniqueDraft = {
      title: modeCopy.title,
      shortTitle: technique.shortTitle,
      description: modeCopy.description,
      whyItMatters: technique.whyItMatters,
      minutes: mode === 'shorter' ? Math.min(8, technique.minutes) : technique.minutes,
      resources: technique.resources.slice(0, mode === 'shorter' ? 1 : 3).map(({ id: _id, ...resource }) => resource),
      practiceTasks: technique.practiceTasks.map((task) => task.label).slice(0, mode === 'shorter' ? 2 : 4),
      keyPoints: technique.keyPoints,
    };

    return normalizeReplacement(goalForReplacement(input), technique, draft);
  }

  async answerCoach(input: CoachRequest) {
    const topic = input.technique?.shortTitle ?? input.goal?.hobbyName ?? 'today’s technique';
    const prompt = input.prompt.toLowerCase();

    if (prompt.includes('easier') || prompt.includes('simpl')) {
      return `Try ${topic} at half speed. Remove one moving part, complete five clean repetitions, then add the next part back.`;
    }
    if (prompt.includes('quiz')) {
      return `Quick check: what is the one cue you should remember before starting ${topic}? Explain it in your own words.`;
    }
    if (prompt.includes('practice')) {
      return `Do one slow repetition of ${topic}, pause, and identify the exact moment that felt uncertain. Practice only that moment next.`;
    }
    return `For ${topic}, focus on one clean cue at a time. Slow the action down, check the result, and change only one thing before repeating.`;
  }
}
