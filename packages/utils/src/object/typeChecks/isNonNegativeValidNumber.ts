import { isNonNegativeNumber, isValidNumber } from "./";

/**
 * 判断是否为非负有效整数
 * @param value
 * @returns
 */
export function isNonNegativeValidNumber(value: unknown): value is number {
  return isNonNegativeNumber(value) && isValidNumber(value);
}
