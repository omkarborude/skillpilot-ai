export function calculateProgress(completedCount: number, totalCount: number) {
  if (totalCount <= 0) {
    return 0;
  }

  return Math.round((completedCount / totalCount) * 100);
}
