import aiData from '../../data/ai.json';
import type { LearningGoal, LearningPlan, PracticeSession, Technique } from '../../shared/types/learning';
import { CoachResponseSchema, LearningPlanSchema } from './schemas';

export interface CoachContext {
  goal: LearningGoal;
  currentTechnique: Technique;
  completedTechniques: Technique[];
  skippedTechniques: Technique[];
  recentPractice: PracticeSession[];
}

export interface AIProvider {
  generatePlan(goal: LearningGoal, seedPlan: LearningPlan): Promise<LearningPlan>;
  coach(prompt: string, context: CoachContext): Promise<{ title: string; message: string; nextStep: string }>;
  reflect(technique: Technique): Promise<string>;
}

export class MockAIProvider implements AIProvider {
  async generatePlan(goal: LearningGoal, seedPlan: LearningPlan) {
    LearningPlanSchema.parse({
      title: `${goal.hobby} Learning Plan`,
      techniques: seedPlan.techniques.map(({ id, title, description, difficulty, estimatedMinutes }) => ({
        id,
        title,
        description,
        difficulty,
        estimatedMinutes,
      })),
    });
    return { ...seedPlan, title: `${goal.hobby} ${seedPlan.title}` };
  }

  async coach(prompt: string, context: CoachContext) {
    return CoachResponseSchema.parse({
      title: prompt,
      message: `For ${context.currentTechnique.title}, keep the exercise smaller than feels necessary. Your goal is ${context.goal.goal.toLowerCase()}, so prioritize smooth, repeatable reps over speed.`,
      nextStep: `Practice ${context.currentTechnique.checklist[0]} for five focused minutes, then pause and notice what changed.`,
    });
  }

  async reflect(technique: Technique) {
    return `Nice work completing ${technique.title}. Your next improvement will come from repeating short sessions before adding complexity.`;
  }
}

export class AIService {
  constructor(private readonly provider: AIProvider = new MockAIProvider()) {}

  getGenerationSteps() {
    return aiData.generationSteps;
  }

  getDashboardInsight() {
    return aiData.insight;
  }

  getCoachPrompts() {
    return aiData.coachPrompts;
  }

  generatePlan(goal: LearningGoal, seedPlan: LearningPlan) {
    return this.provider.generatePlan(goal, seedPlan);
  }

  coach(prompt: string, context: CoachContext) {
    return this.provider.coach(prompt, context);
  }

  reflect(technique: Technique) {
    return this.provider.reflect(technique);
  }
}

export const aiService = new AIService();
