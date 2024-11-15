import "../pollyfill/promise-with-resolvers";
import { CreateWeakMap } from "@/object/createWeakMap";

interface DelayResult {
  cancelled: boolean;
}

type DelayPromise = Promise<DelayResult>;

const cancelMap = CreateWeakMap<DelayPromise, () => void>();

function delay(ms: number): DelayPromise {
  if (typeof ms !== "number" || ms < 0 || !Number.isFinite(ms)) {
    throw new Error("Delay time must be a non-negative finite number");
  }
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
  cancelMap.set(promise, () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    resolve({ cancelled: true });
  });
  promise.finally(() => {
    cancelMap.delete(promise);
  });
  return promise;
}

function cancelDelay(promise: DelayPromise) {
  cancelMap.get(promise)?.();
}

export { delay, cancelDelay };
