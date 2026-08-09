import type {
  CoachRequest,
  LearnerGoal,
  LearningPlan,
  ReplaceTechniqueRequest,
  Technique,
} from '../contracts.js';
import type { LearningProvider } from '../providers/learning-provider.js';

export type ServiceResult<T> = {
  data: T;
  provider: LearningProvider['name'];
  fallbackUsed: boolean;
};

export class LearningService {
  constructor(
    private readonly primary: LearningProvider,
    private readonly fallback: LearningProvider,
  ) {}

  get providerName() {
    return this.primary.name;
  }

  private async execute<T>(operation: (provider: LearningProvider) => Promise<T>): Promise<ServiceResult<T>> {
    try {
      return {
        data: await operation(this.primary),
        provider: this.primary.name,
        fallbackUsed: false,
      };
    } catch (error) {
      if (this.primary === this.fallback) throw error;
      console.error('Primary learning provider failed; using deterministic fallback.', error);
      return {
        data: await operation(this.fallback),
        provider: this.fallback.name,
        fallbackUsed: true,
      };
    }
  }

  generatePlan(goal: LearnerGoal): Promise<ServiceResult<LearningPlan>> {
    return this.execute((provider) => provider.generatePlan(goal));
  }

  replaceTechnique(input: ReplaceTechniqueRequest): Promise<ServiceResult<Technique>> {
    return this.execute((provider) => provider.replaceTechnique(input));
  }

  answerCoach(input: CoachRequest): Promise<ServiceResult<{ answer: string }>> {
    return this.execute(async (provider) => ({ answer: await provider.answerCoach(input) }));
  }
}
