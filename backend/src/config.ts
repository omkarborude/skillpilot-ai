import { z } from 'zod';

const EnvironmentSchema = z.object({
  AI_PROVIDER: z.enum(['mock', 'gemini']).default('mock'),
  GEMINI_API_KEY: z.string().trim().optional(),
  GEMINI_MODEL: z.string().trim().default('gemini-3.5-flash-lite'),
  ALLOWED_ORIGINS: z.string().default('*'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
});

export type AppConfig = {
  aiProvider: 'mock' | 'gemini';
  geminiApiKey?: string;
  geminiModel: string;
  allowedOrigins: string[] | '*';
  port: number;
};

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = EnvironmentSchema.parse(environment);

  if (parsed.AI_PROVIDER === 'gemini' && !parsed.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required when AI_PROVIDER=gemini');
  }

  return {
    aiProvider: parsed.AI_PROVIDER,
    geminiApiKey: parsed.GEMINI_API_KEY,
    geminiModel: parsed.GEMINI_MODEL,
    allowedOrigins:
      parsed.ALLOWED_ORIGINS === '*'
        ? '*'
        : parsed.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean),
    port: parsed.PORT,
  };
}
