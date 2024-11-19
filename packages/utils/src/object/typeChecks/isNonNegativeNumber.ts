import { isNumber } from "./isNumber";

/**
 * 判断是否为非负整数
 * @param value
 * @returns
 */
export function isNonNegativeNumber(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value) && value >= 0;
}
