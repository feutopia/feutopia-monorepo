import { ShallowRef } from "vue";

export type ShallowRefObject<T> = {
  [K in keyof T]: ShallowRef<T[K]>;
};

export type ValueOrEmptyArray<T> = T | never[];
