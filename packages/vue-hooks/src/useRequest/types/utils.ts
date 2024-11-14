import { Ref, ShallowRef } from "vue";

export type Noop = () => void;

type UnwrapRefRecursive<T> = T extends () => infer R
  ? UnwrapRefRecursive<R>
  : T extends Ref<infer V>
    ? V
    : T;

export type UnwrapRefArray<T extends unknown[]> = {
  [K in keyof T]: UnwrapRefRecursive<T[K]>;
};

export type ShallowRefObject<T> = {
  [K in keyof T]: ShallowRef<T[K]>;
};
