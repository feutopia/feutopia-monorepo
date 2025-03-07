import "../pollyfill/promise-with-resolvers";
import { CreateWeakMap } from "@/object/createWeakMap";
import { isNonNegativeNumber } from "..";

type DelayResult = boolean;

export type DelayPromise = Promise<DelayResult> & {
  isRunning: boolean;
};

const createDelay = (ms: number, callback?: () => void) => {
  const timeoutId = setTimeout(() => callback?.(), ms);
  return () => clearTimeout(timeoutId);
};

const cancelStore = CreateWeakMap<DelayPromise, () => void>();

function delay(ms: number, callback?: () => void): DelayPromise {
  if (!isNonNegativeNumber(ms)) {
    throw new Error("Delay time must be a non-negative number");
  }

  let isRunning = true;
  const { resolve, promise } = Promise.withResolvers<DelayResult>();

  const done = () => {
    resolve(false);
    callback?.();
  };

  const stop = createDelay(ms, done);

  const delayPromise = Object.defineProperty(promise, "isRunning", {
    get: () => isRunning,
  }) as DelayPromise;

  cancelStore.set(delayPromise, () => {
    if (isRunning) {
      isRunning = false;
      stop();
      resolve(true);
    }
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
