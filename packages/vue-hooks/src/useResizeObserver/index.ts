import { computed, MaybeRefOrGetter, toValue, watch } from "vue";
import { tryOnScopeDispose } from "../utils";

export function useResizeObserver(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  callback: (entries: ResizeObserverEntry[]) => void
) {
  let observer: ResizeObserver | null = null;
  const isSupported = computed(() => "ResizeObserver" in window);

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  const stopWatch = watch(
    () => toValue(target),
    (el) => {
      cleanup();
      if (el && isSupported.value) {
        observer = new window.ResizeObserver(callback);
        observer.observe(el);
      }
    },
    { immediate: true, flush: "post" }
  );

  tryOnScopeDispose(() => {
    stopWatch();
    cleanup();
  });

  const stop = () => {
    stopWatch();
  };

  return { isSupported, stop };
}
