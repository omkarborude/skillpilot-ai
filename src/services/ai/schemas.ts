import { z } from 'zod';

export const TechniqueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedMinutes: z.number().positive(),
});

export const LearningPlanSchema = z.object({
  title: z.string(),
  techniques: z.array(TechniqueSchema).min(5).max(8),
});

export const CoachResponseSchema = z.object({
  title: z.string(),
  message: z.string(),
  nextStep: z.string(),
});
