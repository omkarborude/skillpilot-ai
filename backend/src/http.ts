import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError, type ZodType } from 'zod';
import { ApiError } from './errors.js';

export type RequestLocals = { requestId: string };

export function requestContext(logRequests = true): RequestHandler {
  return (request, response, next) => {
    const suppliedId = request.header('x-request-id');
    const requestId = suppliedId?.match(/^[a-zA-Z0-9_-]{8,80}$/) ? suppliedId : randomUUID();
    const startedAt = performance.now();

    response.locals.requestId = requestId;
    response.setHeader('x-request-id', requestId);
    response.setHeader('cache-control', 'no-store');

    if (logRequests) {
      response.on('finish', () => {
        console.info(
          JSON.stringify({
            requestId,
            method: request.method,
            path: request.path,
            status: response.statusCode,
            durationMs: Math.round(performance.now() - startedAt),
          }),
        );
      });
    }
    next();
  };
}

export function cors(allowedOrigins: string[] | '*'): RequestHandler {
  return (request, response, next) => {
    const origin = request.header('origin');
    const originAllowed = !origin || allowedOrigins === '*' || allowedOrigins.includes(origin);

    if (!originAllowed) return next(new ApiError(403, 'ORIGIN_NOT_ALLOWED', 'Origin is not allowed'));
    response.setHeader('access-control-allow-origin', allowedOrigins === '*' ? '*' : (origin ?? 'null'));
    response.setHeader('access-control-allow-methods', 'GET,POST,OPTIONS');
    response.setHeader('access-control-allow-headers', 'content-type,x-request-id');
    response.setHeader('vary', 'Origin');

    if (request.method === 'OPTIONS') return response.status(204).end();
    next();
  };
}

export function parseBody<T>(schema: ZodType<T>, request: Request): T {
  const result = schema.safeParse(request.body);
  if (!result.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Request body is invalid', result.error.flatten());
  }
  return result.data;
}

export function notFound(request: Request, _response: Response, next: NextFunction) {
  next(new ApiError(404, 'ROUTE_NOT_FOUND', `No route for ${request.method} ${request.path}`));
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  const requestId = response.locals.requestId as string;
  const apiError =
    error instanceof ApiError
      ? error
      : error instanceof ZodError
        ? new ApiError(400, 'VALIDATION_ERROR', 'Request data is invalid', error.flatten())
        : new ApiError(500, 'INTERNAL_ERROR', 'Something went wrong');

  if (apiError.status >= 500) console.error('Unhandled API error', { requestId, error });

  response.status(apiError.status).json({
    error: {
      code: apiError.code,
      message: apiError.message,
      ...(apiError.details ? { details: apiError.details } : {}),
      requestId,
    },
  });
}
