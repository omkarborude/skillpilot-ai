import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { ProgressBar, StatusBadge } from '../ui';

describe('shared UI states', () => {
  it('exposes progress to assistive technology', async () => {
    const screen = await render(<ProgressBar value={43} />);
    expect(screen.getByRole('progressbar').props.accessibilityValue).toEqual({ min: 0, max: 100, now: 43 });
  });

  it('renders a human-readable technique status', async () => {
    const screen = await render(<StatusBadge status="completed" />);
    expect(screen.getByText('Completed')).toBeTruthy();
  });
});
