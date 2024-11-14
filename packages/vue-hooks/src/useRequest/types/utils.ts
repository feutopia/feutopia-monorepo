import { Ref, ShallowRef } from "vue";

export type ArrayElement<T> = T extends (infer E)[] ? E : T;

export type Noop = () => void;

export type UnwrapRefGetter<T> = T extends () => infer R
  ? UnwrapRefGetter<R>
  : T extends Ref<infer V>
    ? V
    : T;

export type UnwrapMaybeRefGetterArray<T extends any[]> = {
  [K in keyof T]: UnwrapRefGetter<T[K]>;
};

export type RefOrGetterRecord<T> = {
  [K in keyof T]: UnwrapRefGetter<T[K]>;
};

export type ShallowRefRecord<T> = {
  [K in keyof T]: ShallowRef<T[K]>;
};
