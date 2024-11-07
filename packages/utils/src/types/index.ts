/**
 * 判断类型是否可能为 null 或 undefined
 * @param T - 类型
 * @returns 是否可能为 null 或 undefined
 * @example
 * type A = IsNullable<number | null> // true
 */
export type IsNullable<T> = T & (null | undefined) extends never ? false : true;

/**
 * 确保类型不为 null 或 undefined
 * @param T - 类型
 * @returns 不为 null 或 undefined 的类型
 * @example
 * type A = RequireNonNull<{ a: number; b: string | null }> // { a: number; b: string }
 */
export type RequireNonNull<T> = IsNullable<T> extends true ? never : T;

/**
 * 过滤掉可能为 null 或 undefined 的属性
 * @param T - 类型
 * @returns 过滤后的类型
 * @example
 * type A = NonNullableProps<{ a: number; b: string | null }> // { a: number }
 */
export type NonNullableProps<T> = {
	[K in keyof T as IsNullable<T[K]> extends true ? never : K]: T[K];
};
