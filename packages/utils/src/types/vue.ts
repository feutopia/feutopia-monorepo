// vue.ts
import type { Ref } from "@vue/runtime-core";

/**
 * 深度解包 Ref
 */
export type DeepUnwrapRef<T> =
  T extends Ref<infer V> // 如果是 Ref 类型
    ? DeepUnwrapRef<V> // 递归展开 Ref 内部的类型
    : T extends (...args: any[]) => infer R // 如果是函数类型
      ? DeepUnwrapRef<R> // 递归展开函数返回值类型
      : T extends object // 如果是对象类型
        ? { [K in keyof T]: DeepUnwrapRef<T[K]> } // 递归展开对象属性
        : T; // 如果是基本类型，直接返回
