import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { ProgressBar, StatusBadge } from '../ui';
import { ResourceCard } from '../ResourceCard';
import type { LearningResource } from '@/types/learning';

describe('shared UI states', () => {
  it('exposes progress to assistive technology', async () => {
    const screen = await render(<ProgressBar value={43} />);
    expect(screen.getByRole('progressbar').props.accessibilityValue).toEqual({ min: 0, max: 100, now: 43 });
  });

  it('renders a human-readable technique status', async () => {
    const screen = await render(<StatusBadge status="completed" />);
    expect(screen.getByText('Completed')).toBeTruthy();
  });

  it('renders an unavailable resource without an actionable control', async () => {
    const incompleteResource = {
      id: 'legacy-resource',
      type: 'video',
      searchQuery: '',
      description: 'An older saved recommendation without a search query.',
    } as LearningResource;

    const screen = await render(<ResourceCard resource={incompleteResource} onPress={() => undefined} />);

    expect(screen.getByText('Search unavailable')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
