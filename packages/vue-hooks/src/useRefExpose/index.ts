import { Ref } from "vue";
import { ComponentPublicInstance } from "vue"; // 引入 Vue 实例类型

export function useRefExpose<T extends ComponentPublicInstance>(
  ref: Ref<T | undefined | null>
) {
  return new Proxy<T>({} as T, {
    get(_target, prop) {
      return ref.value?.[prop as keyof T];
    },
    has(_target, prop) {
      return ref.value ? prop in ref.value : false;
    },
  });
}
