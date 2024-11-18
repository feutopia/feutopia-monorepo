// nullable.ts
/**
 * 判断类型是否可能为 null 或 undefined
 */
export type IsNullable<T> = T & (null | undefined) extends never ? false : true;

/**
 * 确保类型不为 null 或 undefined
 */
export type RequireNonNull<T> = IsNullable<T> extends true ? never : T;

/**
 * 过滤掉可能为 null 或 undefined 的属性
 */
export type NonNullableProps<T> = {
  [K in keyof T as IsNullable<T[K]> extends true ? never : K]: T[K];
};
