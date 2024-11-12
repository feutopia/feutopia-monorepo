import { tryOnScopeDispose } from "../utils";
import { MaybeRefOrGetter, ref, toValue, watch } from "vue";

type UseIntervalFnOptions = {
  /**
   * Start the timer immediately
   *
   * @default false
   */
  immediate?: boolean;
};

export function useInterval(
  callback: () => void,
  interval: MaybeRefOrGetter<number> = 1000,
  options: UseIntervalFnOptions = {}
) {
  const { immediate = false } = options;

  let timer: number | null = null;
  const isActive = ref(true);

  const clean = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const resume = () => {
    isActive.value = true;
    clean();
    timer = window.setInterval(() => callback(), toValue(interval));
  };

  const pause = () => {
    isActive.value = false;
    clean();
  };

  watch(
    () => toValue(interval),
    () => {
      clean();
      if (isActive.value) {
        resume();
      }
    },
    { immediate: true }
  );

  if (immediate) {
    callback();
  }

  tryOnScopeDispose(() => {
    pause();
  });

  return {
    pause,
    resume,
    isActive,
  };
}
