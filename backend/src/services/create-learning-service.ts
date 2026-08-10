import type { AppConfig } from '../config.js';
import { GeminiLearningProvider } from '../providers/gemini-learning-provider.js';
import { LearningService } from './learning-service.js';

export function createLearningService(config: AppConfig): LearningService {
  const primary = new GeminiLearningProvider(config.geminiApiKey!, config.geminiModel);
  return new LearningService(primary);
}
