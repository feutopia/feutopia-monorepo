import { getType } from "./getType";

/**
 * 判断是否是 Map
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 Map
 */
export function isMap(value: any): value is Map<any, any> {
  return getType(value) === "map";
}
