import blueprintJson from './hobby-blueprints.json' with { type: 'json' };
import { z } from 'zod';
import { HobbyIdSchema, ResourceTypeSchema } from '../contracts.js';

const BlueprintTechniqueSchema = z.object({
  title: z.string(),
  shortTitle: z.string(),
  description: z.string(),
  whyItMatters: z.string(),
  minutes: z.number().int(),
  resourceTypes: z.array(ResourceTypeSchema).min(1).max(3),
  practiceTasks: z.array(z.string()).min(2).max(4),
  keyPoints: z.array(z.string()).min(2).max(5),
});

const BlueprintSchema = z.object({
  title: z.string(),
  outcome: z.string(),
  totalWeeks: z.number().int(),
  techniques: z.array(BlueprintTechniqueSchema).min(5).max(8),
});

const BlueprintCatalogSchema = z.record(HobbyIdSchema, BlueprintSchema);

export const blueprintCatalog = BlueprintCatalogSchema.parse(blueprintJson);
export type HobbyBlueprint = z.infer<typeof BlueprintSchema>;
