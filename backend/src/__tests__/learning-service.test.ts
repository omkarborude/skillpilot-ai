import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { LearnerGoal } from '../contracts.js';
import type { LearningProvider } from '../providers/learning-provider.js';
import { MockLearningProvider } from '../providers/mock-learning-provider.js';
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

describe('LearningService fallback', () => {
  it('uses deterministic data when the external model fails', async () => {
    const fallback = new MockLearningProvider();
    const service = new LearningService(failingProvider, fallback);
    const originalError = console.error;
    console.error = () => undefined;

    try {
      const result = await service.generatePlan(goal);
      assert.equal(result.provider, 'mock');
      assert.equal(result.fallbackUsed, true);
      assert.equal(result.data.techniques.length, 7);
    } finally {
      console.error = originalError;
    }
  });
});
