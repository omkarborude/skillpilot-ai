import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { LearnerGoal, TechniqueDraft } from '../contracts.js';
import { normalizeTechniqueDraft } from '../domain/normalizers.js';

const chessGoal: LearnerGoal = {
  hobbyId: 'chess',
  hobbyName: 'Chess',
  reason: 'confidence',
  level: 'beginner',
  dailyMinutes: 20,
};

const draft: TechniqueDraft = {
  title: 'Recognize simple tactical patterns',
  shortTitle: 'Tactical patterns',
  description: 'Practice spotting one-move threats before calculating longer lines.',
  whyItMatters: 'Fast pattern recognition helps a learner avoid mistakes and find opportunities.',
  minutes: 20,
  resources: [
    {
      type: 'audio',
      searchQuery: 'chess tactics audio lesson',
      description: 'Listen to an explanation of common tactical patterns.',
    },
    {
      type: 'practice',
      description: 'Solve a short set of tactical positions with the checklist.',
    },
  ],
  practiceTasks: ['Check forcing moves first', 'Solve five tactical positions'],
  keyPoints: ['Look for checks first', 'Verify the opponent response'],
};

describe('resource normalization', () => {
  it('maps an inappropriate audio choice to an explicit article search without source metadata', () => {
    const technique = normalizeTechniqueDraft(chessGoal, draft, 1);
    const resource = technique.resources[0];

    assert.deepEqual(resource, {
      id: 'chess-1-tactical-patterns-resource-1',
      type: 'article',
      searchQuery: 'Chess Tactical patterns beginner guide',
      description: 'Look for a concise explanation with examples you can apply during practice.',
    });
    assert.equal('title' in resource!, false);
    assert.equal('durationLabel' in resource!, false);
    assert.equal('url' in resource!, false);
  });
});
