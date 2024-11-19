import { isNumber } from "./isNumber";

/**
 * 判断是否为 number
 * @param value
 * @returns
 */
export const isValidNumber = (value: unknown): value is number =>
  isNumber(value) && !isNaN(value) && isFinite(value);
