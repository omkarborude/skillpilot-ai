import { calculateProgress } from '../utils/progress';

describe('calculateProgress', () => {
  it('returns zero when there is nothing to complete', () => {
    expect(calculateProgress(0, 0)).toBe(0);
  });

  it('rounds progress for dashboard and progress screens', () => {
    expect(calculateProgress(3, 7)).toBe(43);
  });
});
