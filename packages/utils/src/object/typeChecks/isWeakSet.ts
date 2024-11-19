import { getType } from "./getType";

/**
 * 判断是否是 WeakSet
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 WeakSet
 */
export function isWeakSet(value: any): value is WeakSet<any> {
  return getType(value) === "weakset";
}
