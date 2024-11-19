/**
 * 判断是否为 undefined
 * @param value
 * @returns
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}
