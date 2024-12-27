// Utility function: Debounce

import { AnyFunction } from "../types";

export function debounce<T extends AnyFunction>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export type DebouncedFunction<T extends AnyFunction> = ReturnType<
  typeof debounce<T>
>;
