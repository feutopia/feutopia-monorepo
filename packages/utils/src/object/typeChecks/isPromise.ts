import { getType } from "./getType";

/**
 * 判断是否是 Promise
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 Promise
 */
export function isPromise(value: any): value is Promise<any> {
  return getType(value) === "promise";
}
