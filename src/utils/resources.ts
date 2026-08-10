import { z } from 'zod';
import type { LearningResource } from '@/types/learning';

const SearchQuerySchema = z.string().trim().min(3).max(160);
const SearchUrlSchema = z.string().url().refine((url) => url.startsWith('https://'), {
  message: 'Resource searches must use HTTPS',
});

export type ResourceDestination =
  | { kind: 'practice' }
  | { kind: 'search'; url: string; actionLabel: string }
  | { kind: 'unavailable' };

export function resolveResourceDestination(resource: LearningResource): ResourceDestination {
  if (resource.type === 'practice') return { kind: 'practice' };

  const query = SearchQuerySchema.safeParse(resource.searchQuery);
  if (!query.success) return { kind: 'unavailable' };

  const isMediaSearch = resource.type === 'video' || resource.type === 'audio';
  const url = isMediaSearch
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query.data)}`
    : `https://www.google.com/search?q=${encodeURIComponent(query.data)}`;
  const validatedUrl = SearchUrlSchema.safeParse(url);

  if (!validatedUrl.success) return { kind: 'unavailable' };
  return {
    kind: 'search',
    url: validatedUrl.data,
    actionLabel: isMediaSearch ? 'Search YouTube' : 'Search the web',
  };
}
