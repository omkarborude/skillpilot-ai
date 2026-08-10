import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { LearnerGoal } from '../contracts.js';
import type { LearningProvider } from '../providers/learning-provider.js';
import { LearningService } from '../services/learning-service.js';

const goal: LearnerGoal = {
  hobbyId: 'guitar',
  hobbyName: 'Guitar',
  reason: 'perform',
  level: 'beginner',
  dailyMinutes: 20,
};

const failingProvider: LearningProvider = {
  name: 'gemini',
  async generatePlan() {
    throw new Error('quota exceeded');
  },
  async replaceTechnique() {
    throw new Error('quota exceeded');
  },
  async answerCoach() {
    throw new Error('quota exceeded');
  },
};

describe('LearningService', () => {
  it('surfaces provider failures instead of returning fabricated learning data', async () => {
    const service = new LearningService(failingProvider);
    await assert.rejects(service.generatePlan(goal), /quota exceeded/);
  });
});
