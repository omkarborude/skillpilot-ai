import { describe, expect, it } from '@jest/globals';
import type { LearningResource } from '@/types/learning';
import { resolveResourceDestination } from '../resources';

describe('resource destinations', () => {
  it('maps a video recommendation to a validated YouTube search URL', () => {
    const resource: LearningResource = {
      id: 'resource-1',
      type: 'video',
      searchQuery: 'beginner guitar chord changes',
      description: 'Look for a slow demonstration with a clear camera angle.',
    };

    expect(resolveResourceDestination(resource)).toEqual({
      kind: 'search',
      url: 'https://www.youtube.com/results?search_query=beginner%20guitar%20chord%20changes',
      actionLabel: 'Search YouTube',
    });
  });

  it('keeps guided practice inside the app', () => {
    const resource: LearningResource = {
      id: 'resource-2',
      type: 'practice',
      description: 'Apply the technique with the timer and checklist.',
    };

    expect(resolveResourceDestination(resource)).toEqual({ kind: 'practice' });
  });

  it('returns an unavailable state when a persisted recommendation has no usable query', () => {
    const incompleteResource = {
      id: 'legacy-resource',
      type: 'article',
      searchQuery: '',
      description: 'An older saved recommendation without a search query.',
    } as LearningResource;

    expect(resolveResourceDestination(incompleteResource)).toEqual({ kind: 'unavailable' });
  });
});
