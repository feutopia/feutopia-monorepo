import { useCallback, useMemo, useRef } from "react";

type Fn = (this: any, ...args: any[]) => any;

export function useEvent<T extends Fn>(callback: T) {
  const callbackRef = useRef<T>(callback);

  callbackRef.current = useMemo(() => callback, [callback]);

  return useCallback(function (this: any, ...args: Parameters<T>) {
    callbackRef.current.apply(this, args);
  }, []);
}
