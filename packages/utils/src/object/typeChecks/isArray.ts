import { getType } from "./getType";

/**
 * 判断是否是数组
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是数组
 */
export function isArray(value: any): value is Array<any> {
  return getType(value) === "array";
}
