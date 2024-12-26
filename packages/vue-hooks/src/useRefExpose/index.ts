import {
  type ComponentPublicInstance,
  type ComponentInternalInstance,
  type Ref,
} from "vue";

// { $: ComponentInternalInstance } 为了兼容 element-plus 的组件实例的类型
export function useRefExpose<
  T extends { $: ComponentInternalInstance } | ComponentPublicInstance,
>(ref: Ref<T | undefined | null>) {
  return new Proxy<T>({} as T, {
    get(_target, prop) {
      return ref.value?.[prop as keyof T];
    },
    has(_target, prop) {
      return ref.value ? prop in ref.value : false;
    },
  });
}
