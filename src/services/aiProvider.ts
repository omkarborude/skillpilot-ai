import type {
  CoachMessage,
  LearnerGoal,
  LearningPlan,
  ReplacementMode,
  Technique,
} from '@/types/learning';
import { HttpAIProvider } from './httpAIProvider';

export type CoachContext = {
  goal: LearnerGoal;
  technique?: Technique;
  journeyProgress: number;
  recentMessages: CoachMessage[];
};

export interface AIPlanProvider {
  generatePlan(goal: LearnerGoal): Promise<LearningPlan>;
  answerCoach(prompt: string, context: CoachContext): Promise<string>;
  replaceTechnique(
    technique: Technique,
    mode: ReplacementMode,
    goal: LearnerGoal,
  ): Promise<Technique>;
}

class UnconfiguredAIProvider implements AIPlanProvider {
  private unavailable(): never {
    throw new Error('The learning service is not configured. Set EXPO_PUBLIC_API_URL and retry.');
  }

  async generatePlan(): Promise<LearningPlan> {
    return this.unavailable();
  }

  async answerCoach(): Promise<string> {
    return this.unavailable();
  }

  async replaceTechnique(): Promise<Technique> {
    return this.unavailable();
  }
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const aiProvider: AIPlanProvider = apiUrl
  ? new HttpAIProvider(apiUrl)
  : new UnconfiguredAIProvider();
