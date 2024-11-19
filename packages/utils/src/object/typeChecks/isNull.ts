/**
 * 判断是否为 null
 * @param value
 * @returns
 */
export function isNull(value: unknown): value is null {
  return value === null;
}
