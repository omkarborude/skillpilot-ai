import express, { type Express } from 'express';
import type { AppConfig } from './config.js';
import {
  CoachRequestSchema,
  GeneratePlanRequestSchema,
  ReplaceTechniqueRequestSchema,
  type ApiMeta,
} from './contracts.js';
import { cors, errorHandler, notFound, parseBody, requestContext } from './http.js';
import type { LearningService, ServiceResult } from './services/learning-service.js';

type AppDependencies = {
  config: AppConfig;
  learningService: LearningService;
  logRequests?: boolean;
};

function responseMeta<T>(result: ServiceResult<T>, requestId: string): ApiMeta {
  return {
    requestId,
    provider: result.provider,
    fallbackUsed: result.fallbackUsed,
  };
}

export function configureApp(app: Express, dependencies: AppDependencies) {
  const { config, learningService, logRequests = true } = dependencies;
  app.disable('x-powered-by');
  app.use(requestContext(logRequests));
  app.use(cors(config.allowedOrigins));
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/v1/health', (_request, response) => {
    response.json({
      data: {
        status: 'ok',
        version: '1.0.0',
        provider: learningService.providerName,
      },
      meta: { requestId: response.locals.requestId },
    });
  });

  app.post('/api/v1/plans/generate', async (request, response) => {
    const { goal } = parseBody(GeneratePlanRequestSchema, request);
    const result = await learningService.generatePlan(goal);
    response.status(201).json({
      data: result.data,
      meta: responseMeta(result, response.locals.requestId),
    });
  });

  app.post('/api/v1/techniques/replace', async (request, response) => {
    const input = parseBody(ReplaceTechniqueRequestSchema, request);
    const result = await learningService.replaceTechnique(input);
    response.json({
      data: result.data,
      meta: responseMeta(result, response.locals.requestId),
    });
  });

  app.post('/api/v1/coach/respond', async (request, response) => {
    const input = parseBody(CoachRequestSchema, request);
    const result = await learningService.answerCoach(input);
    response.json({
      data: result.data,
      meta: responseMeta(result, response.locals.requestId),
    });
  });

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export function createApp(dependencies: AppDependencies) {
  return configureApp(express(), dependencies);
}
