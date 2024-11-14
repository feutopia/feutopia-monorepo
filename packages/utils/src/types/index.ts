import type { Ref } from "@vue/runtime-core";

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

/**
 * Void function
 * @example
 * const fn: Noop = () => {}
 */
export type Noop = () => void;

/**
 * Any function
 * @example
 * const fn: AnyFn = (a: number, b: string) => {}
 */
export type AnyFn = (...args: any[]) => any;

/**
 * Empty array
 * @example
 * const arr: EmptyArray = []
 */
export type EmptyArray = never[];

/**
 * 深度解包 Ref
 * @param T - 类型
 * @returns 解包后的类型
 * @example
 * type A = DeepUnwrapRef<Ref<number>> // number
 * type B = DeepUnwrapRef<() => Ref<number>> // number
 * type C = DeepUnwrapRef<ComputedRef<number>> // number
 * type D = DeepUnwrapRef<{a: Ref<number>, b: string}> // {a: number, b: string}
 */
export type DeepUnwrapRef<T> =
  T extends Ref<infer V> // 如果是 Ref 类型
    ? DeepUnwrapRef<V> // 递归展开 Ref 内部的类型
    : T extends (...args: any[]) => infer R // 如果是函数类型
      ? DeepUnwrapRef<R> // 递归展开函数返回值类型
      : T extends object // 如果是对象类型
        ? { [K in keyof T]: DeepUnwrapRef<T[K]> } // 递归展开对象属性
        : T; // 如果是基本类型，直接返回
