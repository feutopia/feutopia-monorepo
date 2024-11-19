import { isNonNegativeValidNumber } from "..";
import "../pollyfill/promise-with-resolvers";
import { CreateWeakMap } from "@/object/createWeakMap";

interface DelayResult {
  cancelled: boolean;
}

export type DelayPromise = Promise<DelayResult> & {
  isRunning: () => boolean;
};

const createRafDelay = (ms: number, callback?: () => void) => {
  const startTime = Date.now();
  let rafId: number;
  const check = () => {
    const timePassed = Date.now() - startTime;
    if (timePassed >= ms) {
      callback?.();
      return;
    }
    rafId = requestAnimationFrame(check);
  };
  check();
  return () => cancelAnimationFrame(rafId);
};

const cancelStore = CreateWeakMap<DelayPromise, () => void>();

function delay(ms: number, callback?: () => void): DelayPromise {
  if (!isNonNegativeValidNumber(ms)) {
    throw new Error("Delay time must be a non-negative finite number");
  }
  let isRunning = true;
  const { resolve, promise } = Promise.withResolvers<DelayResult>();
  const done = () => {
    resolve({ cancelled: false });
    callback?.();
  };
  const stop = createRafDelay(ms, done);
  const delayPromise = Object.assign(promise, { isRunning: () => isRunning });
  cancelStore.set(delayPromise, () => {
    stop();
    resolve({ cancelled: true });
  });
  promise.finally(() => {
    isRunning = false;
    cancelStore.delete(delayPromise);
  });
  return delayPromise;
}

function cancelDelay(promise: DelayPromise) {
  cancelStore.get(promise)?.();
}

export { delay, cancelDelay };
