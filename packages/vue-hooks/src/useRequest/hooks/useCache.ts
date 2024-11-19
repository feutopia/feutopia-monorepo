import { tryOnScopeDispose } from "@/utils";
import { toValue, watch } from "vue";
import { CacheKey, RequestControlOptions, Service } from "../types/request";
import {
  cancelDelay,
  DeepUnwrapRef,
  delay,
  DelayPromise,
  isNonNegativeNumber,
} from "@feutopia/utils";

type Params<TData, TParams extends any[]> = Pick<
  RequestControlOptions,
  "cacheKey" | "cacheTime"
> & {
  getService: () => Service<TData, DeepUnwrapRef<TParams>>;
  setService: (value: Service<TData, DeepUnwrapRef<TParams>>) => void;
};

const cacheStore = new Map<CacheKey, Promise<unknown>>();

export function clearCache(cacheKey: CacheKey) {
  cacheStore.delete(cacheKey);
}

export function useCache<TData, TParams extends any[]>(
  params: Params<TData, TParams>
) {
  const originalService = params.getService();
  let delayedTask: DelayPromise | null = null;

  // 重置服务
  const resetService = () => {
    params.setService(originalService);
  };

  // 清理的是延迟状态和服务
  const clearDelayedState = () => {
    if (delayedTask) {
      cancelDelay(delayedTask);
      delayedTask = null;
    }
    resetService();
  };

  // 清理特定的缓存条目
  const clearCacheEntry = (cacheKey: CacheKey) => {
    cacheStore.delete(cacheKey);
    resetService();
  };

  // 设置缓存服务
  const setCacheService = (cacheKey: CacheKey) => {
    const cachedService = (...args: DeepUnwrapRef<TParams>) => {
      const cachedResult = cacheStore.get(cacheKey);
      if (cachedResult) return cachedResult as Promise<TData>;
      const promise = originalService(...args);
      cacheStore.set(cacheKey, promise);
      promise
        .then((result) => {
          const cacheTime = toValue(params.cacheTime);
          if (isNonNegativeNumber(cacheTime)) {
            cacheStore.set(cacheKey, Promise.resolve(result));
            delayedTask = delay(cacheTime, () => {
              clearCacheEntry(cacheKey);
            });
          } else {
            clearCacheEntry(cacheKey);
          }
        })
        .catch(() => {
          clearCacheEntry(cacheKey);
        });
      return promise;
    };
    params.setService(cachedService);
  };

  // 监听缓存时间
  watch(
    () => toValue(params.cacheTime),
    (cacheTime) => {
      if (!isNonNegativeNumber(cacheTime)) return;
      if (delayedTask?.isRunning()) {
        cancelDelay(delayedTask);
        const cacheKey = toValue(params.cacheKey);
        if (cacheKey) {
          delayedTask = delay(cacheTime, () => {
            clearCacheEntry(cacheKey);
          });
        }
      }
    }
  );

  // 监听缓存key
  watch(
    () => toValue(params.cacheKey),
    (cacheKey) => {
      clearDelayedState();
      if (cacheKey) {
        setCacheService(cacheKey);
      }
    },
    { immediate: true }
  );

  // 销毁时清理
  tryOnScopeDispose(() => {
    clearDelayedState();
  });
}
