import { LearnerGoal, LearningPlan, ReplacementMode, Technique } from '@/types/learning';
import { planRepository } from './planRepository';

export interface AIPlanProvider {
  generatePlan(goal: LearnerGoal): Promise<LearningPlan>;
  answerCoach(prompt: string, technique?: Technique): Promise<string>;
  replaceTechnique(technique: Technique, mode: ReplacementMode): Promise<Technique>;
}

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

class MockAIProvider implements AIPlanProvider {
  async generatePlan(goal: LearnerGoal): Promise<LearningPlan> {
    return planRepository.getTemplate(goal);
  }

  async answerCoach(prompt: string, technique?: Technique): Promise<string> {
    await wait(450);
    const topic = technique?.shortTitle ?? 'today’s technique';
    const normalizedPrompt = prompt.toLowerCase();

    if (normalizedPrompt.includes('easier') || normalizedPrompt.includes('simpl')) {
      return `Try ${topic} at half speed. Remove one moving part, complete five clean repetitions, then add the next part back. What matters is a repeatable motion—not speed.`;
    }

    if (normalizedPrompt.includes('quiz')) {
      return `Quick check: what is the one cue you should remember before starting ${topic}? Answer in your own words and I’ll help sharpen it.`;
    }

    if (normalizedPrompt.includes('practice')) {
      return `Let’s practice together: do one slow repetition of ${topic}, pause, and tell me which exact moment felt uncertain. We’ll fix only that moment.`;
    }

    return `For ${topic}, focus on one clean cue at a time. Based on your question—“${prompt}”—I’d first reduce the speed, check the result, and only then repeat.`;
  }

  async replaceTechnique(technique: Technique, mode: ReplacementMode): Promise<Technique> {
    await wait(350);
    const modeCopy = {
      simpler: {
        title: `Foundation version: ${technique.shortTitle}`,
        description: `A simpler version of ${technique.description.toLowerCase()}`,
      },
      shorter: {
        title: `Eight-minute ${technique.shortTitle.toLowerCase()}`,
        description: 'A compact practice that keeps only the highest-impact action.',
      },
      different: {
        title: `A different route to ${technique.shortTitle.toLowerCase()}`,
        description: 'Learn the same outcome through a new explanation and practice pattern.',
      },
    }[mode];

    return {
      ...technique,
      ...modeCopy,
      minutes: mode === 'shorter' ? Math.min(8, technique.minutes) : technique.minutes,
      resources: mode === 'shorter' ? technique.resources.slice(0, 1) : technique.resources,
      replaced: true,
    };
  }
}

export const aiProvider: AIPlanProvider = new MockAIProvider();
