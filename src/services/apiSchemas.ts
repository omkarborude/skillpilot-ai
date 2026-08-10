import { z } from 'zod';

const HobbyIdSchema = z.enum(['guitar', 'chess', 'photography', 'drawing', 'custom']);
const ResourceDescriptionSchema = z.string().trim().min(8).max(240);

export const LearningResourceSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string().min(1),
    type: z.enum(['video', 'audio', 'article']),
    searchQuery: z.string().trim().min(3).max(160),
    description: ResourceDescriptionSchema,
  }).strict(),
  z.object({
    id: z.string().min(1),
    type: z.literal('practice'),
    description: ResourceDescriptionSchema,
  }).strict(),
]);

export const TechniqueSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(1).max(8),
  title: z.string().trim().min(3).max(100),
  shortTitle: z.string().trim().min(2).max(60),
  description: z.string().trim().min(10).max(320),
  whyItMatters: z.string().trim().min(10).max(320),
  minutes: z.number().int().min(5).max(120),
  status: z.enum(['completed', 'in_progress', 'locked', 'skipped']),
  resources: z.array(LearningResourceSchema).min(1).max(4),
  practiceTasks: z.array(z.object({
    id: z.string().min(1),
    label: z.string().trim().min(3).max(120),
  })).min(2).max(5),
  keyPoints: z.array(z.string().trim().min(3).max(120)).min(2).max(5),
  replaced: z.boolean().optional(),
});

export const LearningPlanSchema = z.object({
  id: z.string().min(1),
  hobbyId: HobbyIdSchema,
  title: z.string().trim().min(3).max(100),
  outcome: z.string().trim().min(10).max(240),
  totalWeeks: z.number().int().min(2).max(12),
  techniques: z.array(TechniqueSchema).min(5).max(8),
});

export const CoachResponseSchema = z.object({ answer: z.string().trim().min(1) });

export const ApiMetaSchema = z.object({
  requestId: z.string().min(1),
  provider: z.string().min(1),
  fallbackUsed: z.boolean(),
});

export const apiEnvelopeSchema = <T extends z.ZodTypeAny>(data: T) => z.object({
  data,
  meta: ApiMetaSchema,
});

export const ApiErrorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string().optional(),
    message: z.string().optional(),
    requestId: z.string().optional(),
  }).optional(),
});
