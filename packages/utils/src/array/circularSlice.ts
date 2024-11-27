export function circularSlice<T>(arr: T[], start: number, count: number): T[] {
  const len = arr.length;
  if (len === 0) return [];
  start = start < 0 ? len + (start % len) : start;
  return Array(count)
    .fill(null)
    .map((_, i) => arr[(start + i) % len]);
}
