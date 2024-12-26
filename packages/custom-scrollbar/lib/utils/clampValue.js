// General range-clamping function
export function clampValue(value, max, min) {
  min = min || 0;
  return Math.max(min, Math.min(value, max));
}
