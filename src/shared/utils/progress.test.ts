import { calculateProgress } from './progress';

describe('calculateProgress', () => {
  it('returns zero when there are no techniques', () => {
    expect(calculateProgress(0, 0)).toBe(0);
  });

  it('rounds completed progress to the nearest whole percentage', () => {
    expect(calculateProgress(3, 7)).toBe(43);
  });
});
