import { getType } from "./getType";
/**
 * 判断是否是 RegExp
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 RegExp
 */
export function isRegExp(value: any): value is RegExp {
  return getType(value) === "regexp";
}
