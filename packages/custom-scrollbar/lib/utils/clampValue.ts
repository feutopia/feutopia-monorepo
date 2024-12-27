// General range-clamping function
export function clampValue(value: number, max: number, min = 0) {
  return Math.max(min, Math.min(value, max));
}
