import { getType } from "./getType";
/**
 * 判断是否是 Date
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 Date
 */
export function isDate(value: any): value is Date {
  return getType(value) === "date";
}
