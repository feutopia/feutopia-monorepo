import { getType } from "./getType";

/**
 * 判断是否是 WeakMap
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 WeakMap
 */
export function isWeakMap(value: any): value is WeakMap<any, any> {
  return getType(value) === "weakmap";
}
