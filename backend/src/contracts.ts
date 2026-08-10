import { z } from 'zod';

export const HobbyIdSchema = z.enum(['guitar', 'chess', 'photography', 'drawing', 'custom']);
export const SkillLevelSchema = z.enum(['beginner', 'some_experience', 'intermediate']);
export const GoalReasonSchema = z.enum(['fun', 'confidence', 'perform', 'create']);
export const ExternalResourceTypeSchema = z.enum(['video', 'audio', 'article']);
export const TechniqueStatusSchema = z.enum(['completed', 'in_progress', 'locked', 'skipped']);
export const ReplacementModeSchema = z.enum(['simpler', 'shorter', 'different']);

export const LearnerGoalSchema = z
  .object({
    hobbyId: HobbyIdSchema,
    hobbyName: z.string().trim().min(2).max(40),
    customHobby: z.string().trim().min(2).max(40).optional(),
    reason: GoalReasonSchema,
    level: SkillLevelSchema,
    dailyMinutes: z.number().int().min(10).max(120),
  })
  .superRefine((goal, context) => {
    if (goal.hobbyId === 'custom' && !goal.customHobby) {
      context.addIssue({
        code: 'custom',
        path: ['customHobby'],
        message: 'customHobby is required when hobbyId is custom',
      });
    }
  });

const ResourceDescriptionSchema = z.string().trim().min(8).max(240);

export const LearningResourceSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string().min(1),
    type: ExternalResourceTypeSchema,
    searchQuery: z.string().trim().min(3).max(160),
    description: ResourceDescriptionSchema,
  }).strict(),
  z.object({
    id: z.string().min(1),
    type: z.literal('practice'),
    description: ResourceDescriptionSchema,
  }).strict(),
]);

export const PracticeTaskSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(3).max(120),
});

export const TechniqueSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(1).max(8),
  title: z.string().trim().min(3).max(100),
  shortTitle: z.string().trim().min(2).max(60),
  description: z.string().trim().min(10).max(320),
  whyItMatters: z.string().trim().min(10).max(320),
  minutes: z.number().int().min(5).max(120),
  status: TechniqueStatusSchema,
  resources: z.array(LearningResourceSchema).min(1).max(4),
  practiceTasks: z.array(PracticeTaskSchema).min(2).max(5),
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

const DraftResourceSchema = z.object({
  type: z.enum(['video', 'audio', 'article', 'practice']),
  searchQuery: z.string().trim().min(3).max(160).optional(),
  description: ResourceDescriptionSchema,
}).strict().superRefine((resource, context) => {
  if (resource.type !== 'practice' && !resource.searchQuery) {
    context.addIssue({
      code: 'custom',
      path: ['searchQuery'],
      message: 'searchQuery is required for external resource recommendations',
    });
  }
  if (resource.type === 'practice' && resource.searchQuery) {
    context.addIssue({
      code: 'custom',
      path: ['searchQuery'],
      message: 'searchQuery is not used for guided practice',
    });
  }
});
const DraftTechniqueSchema = TechniqueSchema.omit({
  id: true,
  order: true,
  status: true,
  replaced: true,
}).extend({
  resources: z.array(DraftResourceSchema).min(1).max(3),
  practiceTasks: z.array(z.string().trim().min(3).max(120)).min(2).max(4),
});

export const PlanDraftSchema = z.object({
  title: z.string().trim().min(3).max(100),
  outcome: z.string().trim().min(10).max(240),
  totalWeeks: z.number().int().min(2).max(12),
  techniques: z.array(DraftTechniqueSchema).min(5).max(8),
});

export const TechniqueDraftSchema = DraftTechniqueSchema;

export const GeneratePlanRequestSchema = z.object({ goal: LearnerGoalSchema });
export const ReplaceTechniqueRequestSchema = z.object({
  technique: TechniqueSchema,
  mode: ReplacementModeSchema,
  goal: LearnerGoalSchema.optional(),
});
export const CoachRequestSchema = z.object({
  prompt: z.string().trim().min(2).max(600),
  technique: TechniqueSchema.optional(),
  goal: LearnerGoalSchema.optional(),
  journeyProgress: z.number().int().min(0).max(100).optional(),
  recentMessages: z
    .array(
      z.object({
        role: z.enum(['learner', 'coach']),
        content: z.string().trim().min(1).max(600),
      }),
    )
    .max(8)
    .optional(),
});

export type LearnerGoal = z.infer<typeof LearnerGoalSchema>;
export type LearningPlan = z.infer<typeof LearningPlanSchema>;
export type Technique = z.infer<typeof TechniqueSchema>;
export type TechniqueDraft = z.infer<typeof TechniqueDraftSchema>;
export type PlanDraft = z.infer<typeof PlanDraftSchema>;
export type ReplacementMode = z.infer<typeof ReplacementModeSchema>;
export type CoachRequest = z.infer<typeof CoachRequestSchema>;
export type ReplaceTechniqueRequest = z.infer<typeof ReplaceTechniqueRequestSchema>;

export type ApiMeta = {
  requestId: string;
  provider: string;
  fallbackUsed: boolean;
};
