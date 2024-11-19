/**
 * 判断是否为函数
 * @param value
 * @returns
 */
export function isFunction<T extends (...args: any[]) => any>(
  value: unknown
): value is T {
  return typeof value === "function";
}
