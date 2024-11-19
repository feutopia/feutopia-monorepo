/**
 * 判断是否是可迭代的对象
 * @param {any} obj - 要检查的对象
 * @returns {boolean} - 返回是否是可迭代的对象
 */
export function isIterable(obj: any): obj is Iterable<any> {
  return obj != null && typeof obj[Symbol.iterator] === "function";
}
