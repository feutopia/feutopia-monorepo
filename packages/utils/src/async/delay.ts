import "../pollyfill/promise-with-resolvers";
import { CreateWeakMap } from "@/object/createWeakMap";

interface DelayResult {
  cancelled: boolean;
}

export type DelayPromise = Promise<DelayResult> & {
  isRunning: () => boolean;
};

const cancelMap = CreateWeakMap<DelayPromise, () => void>();

function delay(ms: number): DelayPromise {
  if (typeof ms !== "number" || ms < 0 || !Number.isFinite(ms)) {
    throw new Error("Delay time must be a non-negative finite number");
  }
  let isRunning = true;
  const { resolve, promise } = Promise.withResolvers<DelayResult>();
  let timeoutId: number | null = null;
  const resolveResult = () => {
    resolve({ cancelled: false });
  };
  if (ms === 0) {
    resolveResult();
  } else {
    timeoutId = window.setTimeout(resolveResult, ms);
  }
  const delayPromise = Object.assign(promise, { isRunning: () => isRunning });
  cancelMap.set(delayPromise, () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    resolve({ cancelled: true });
  });
  promise.finally(() => {
    isRunning = false;
    cancelMap.delete(delayPromise);
  });
  return delayPromise;
}

function cancelDelay(promise: DelayPromise) {
  cancelMap.get(promise)?.();
}

export { delay, cancelDelay };
