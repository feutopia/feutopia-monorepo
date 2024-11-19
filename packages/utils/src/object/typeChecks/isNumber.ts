/**
 * 判断是否为 number, 包括 NaN
 * @param value
 * @returns
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}
