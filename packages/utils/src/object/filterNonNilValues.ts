import { NonNullableProps } from "@/types";
/**
 * 过滤掉对象中值为 null 或 undefined 的属性
 * @param obj - 对象
 * @returns 过滤后的对象
 * @example
 * filterNonNilValues({ a: 1, b: null, c: undefined }) // { a: 1 }
 */
export function filterNonNilValues<T extends Record<string, any>>(
	obj: T
): NonNullableProps<T> {
	return Object.fromEntries(
		Object.entries(obj).filter(
			([_, value]) => value !== undefined && value !== null
		)
	) as NonNullableProps<T>;
}
