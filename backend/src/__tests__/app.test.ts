import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import request from 'supertest';
import { createApp } from '../app.js';
import type { AppConfig } from '../config.js';
import { FixtureLearningProvider } from './fixture-learning-provider.js';
import { LearningService } from '../services/learning-service.js';

const config: AppConfig = {
  aiProvider: 'gemini',
  geminiModel: 'gemini-3.5-flash-lite',
  allowedOrigins: '*',
  port: 3001,
};
const testProvider = new FixtureLearningProvider();
const app = createApp({
  config,
  learningService: new LearningService(testProvider),
  logRequests: false,
});

const chessGoal = {
  hobbyId: 'chess',
  hobbyName: 'Chess',
  reason: 'confidence',
  level: 'beginner',
  dailyMinutes: 20,
} as const;

describe('SkillPilot API', () => {
  it('reports health without exposing configuration secrets', async () => {
    const response = await request(app).get('/api/v1/health').expect(200);

    assert.equal(response.body.data.status, 'ok');
    assert.equal(response.body.data.provider, 'gemini');
    assert.equal(typeof response.body.meta.requestId, 'string');
    assert.equal(response.headers['x-powered-by'], undefined);
  });

  it('validates goal constraints at the HTTP boundary', async () => {
    const response = await request(app)
      .post('/api/v1/plans/generate')
      .send({ goal: { ...chessGoal, dailyMinutes: 2 } })
      .expect(400);

    assert.equal(response.body.error.code, 'VALIDATION_ERROR');
    assert.equal(typeof response.body.error.requestId, 'string');
  });

  it('does not expose the removed production hobby catalog', async () => {
    const response = await request(app).get('/api/v1/hobbies').expect(404);
    assert.equal(response.body.error.code, 'ROUTE_NOT_FOUND');
  });

  it('generates a plan with valid progression and honest resource recommendations', async () => {
    const response = await request(app)
      .post('/api/v1/plans/generate')
      .send({ goal: chessGoal })
      .expect(201);

    const plan = response.body.data;
    assert.ok(plan.techniques.length >= 5 && plan.techniques.length <= 8);
    assert.equal(plan.techniques[0].status, 'in_progress');
    assert.ok(plan.techniques.slice(1).every((technique: { status: string }) => technique.status === 'locked'));
    assert.ok(
      plan.techniques.every((technique: { resources: { type: string }[] }) =>
        technique.resources.every((resource) => resource.type !== 'audio'),
      ),
    );
    const externalResources = plan.techniques.flatMap(
      (technique: { resources: { type: string; searchQuery?: string; title?: string; durationLabel?: string; url?: string }[] }) =>
        technique.resources.filter((resource) => resource.type !== 'practice'),
    );
    assert.ok(externalResources.every((resource: { searchQuery?: string }) => resource.searchQuery));
    assert.ok(externalResources.every((resource: { title?: string; durationLabel?: string; url?: string }) =>
      resource.title === undefined && resource.durationLabel === undefined && resource.url === undefined,
    ));
    assert.equal(response.body.meta.provider, 'gemini');
    assert.equal(response.body.meta.fallbackUsed, false);
  });

  it('replaces a technique without changing its identity or order', async () => {
    const generated = await request(app).post('/api/v1/plans/generate').send({ goal: chessGoal });
    const original = generated.body.data.techniques[0];
    const response = await request(app)
      .post('/api/v1/techniques/replace')
      .send({ technique: original, mode: 'shorter', goal: chessGoal })
      .expect(200);

    assert.equal(response.body.data.id, original.id);
    assert.equal(response.body.data.order, original.order);
    assert.equal(response.body.data.replaced, true);
    assert.ok(response.body.data.minutes <= 8);
  });

  it('returns contextual coach guidance', async () => {
    const response = await request(app)
      .post('/api/v1/coach/respond')
      .send({ prompt: 'Can you make this easier?', goal: chessGoal })
      .expect(200);

    assert.match(response.body.data.answer, /half speed/i);
  });
});
