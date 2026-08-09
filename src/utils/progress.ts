export function calculateProgress(completedCount: number, totalCount: number) {
  if (totalCount <= 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
}

export function unique(values: string[]) {
  return Array.from(new Set(values));
}
