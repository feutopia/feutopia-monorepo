import { getType } from "./getType";

/**
 * 判断是否是 Set
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 Set
 */
export function isSet(value: any): value is Set<any> {
  return getType(value) === "set";
}
