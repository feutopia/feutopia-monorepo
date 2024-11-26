import { useRef, useMemo } from "react";

type AnyFunction = (...args: any[]) => any;

export function useStableFn<T extends AnyFunction>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = useMemo<T>(() => fn, [fn]);

  const boundRef = useRef<T>();
  if (!boundRef.current) {
    const boundFn = function (
      this: ThisParameterType<T>,
      ...args: Parameters<T>
    ) {
      return fnRef.current.apply(this, args);
    };
    Object.assign(boundFn, fn);
    boundRef.current = fn;
  }
  return boundRef.current;
}
