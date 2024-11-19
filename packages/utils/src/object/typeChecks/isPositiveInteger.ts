import { isNumber } from "./isNumber";
/**
 * 判断是否为正整数
 * @param value
 * @returns
 */
export function isPositiveInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value) && value > 0;
}
