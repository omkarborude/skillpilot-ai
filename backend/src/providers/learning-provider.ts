import type {
  CoachRequest,
  LearnerGoal,
  LearningPlan,
  ReplaceTechniqueRequest,
  Technique,
} from '../contracts.js';

export interface LearningProvider {
  readonly name: 'mock' | 'gemini';
  generatePlan(goal: LearnerGoal): Promise<LearningPlan>;
  replaceTechnique(input: ReplaceTechniqueRequest): Promise<Technique>;
  answerCoach(input: CoachRequest): Promise<string>;
}
