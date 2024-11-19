import { getType } from "./getType";

/**
 * 判断是否是 Error
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 Error
 */
export function isError(value: any): value is Error {
  return getType(value) === "error";
}
