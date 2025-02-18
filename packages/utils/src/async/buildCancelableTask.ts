import "../pollyfill/promise-with-resolvers";

// 返回的结果类型
type Result<T> = {
  readonly data?: T;
  readonly error?: Error;
  readonly cancelled: boolean;
};

// 入参 async 函数
type Service<T, K extends any[]> = (...params: K) => Promise<T> & {
  cancel?: () => void;
};

// 取消错误
const CANCELED_ERROR = new Error("PROMISE_CANCELLED");

type CancelableTask<K extends any[], T> = {
  run: (...params: K) => Promise<Result<T>>;
  cancel: () => void;
  isRunning: boolean;
  cancelled: boolean;
};

/**
 * 构建一个可取消的任务
 * @param service - 服务函数
 * @returns 可取消的任务
 * @example
 * const task = buildCancelableTask(fetchData);
 * task.run(1, 2, 3);
 * task.cancel();
 */
export const buildCancelableTask = <T, K extends any[]>(
  service: Service<T, K>
): CancelableTask<K, T> => {
  let isRunning = false; // 是否正在运行
  let cancelled = false; // 是否取消
  let completed = false; // 是否完成
  let taskPromise: ReturnType<Service<T, K>> | null = null; // promise 函数
  const { promise, reject } = Promise.withResolvers<T>();
  promise.catch(() => {}); // 当task先cancel后run时, 会出现未捕获的错误, 所以得加 catch 捕获

  const run = (...params: K): Promise<Result<T>> => {
    if (cancelled) {
      // 如果取消了, 直接返回 Promise, 不执行 service
      return Promise.resolve({
        cancelled: true,
      });
    }
    isRunning = true;
    taskPromise = service(...params);
    return Promise.race([taskPromise, promise])
      .then((data) => ({
        data,
        cancelled: false,
      }))
      .catch((error) => ({
        ...(cancelled ? {} : { error }),
        cancelled,
      }))
      .finally(() => {
        completed = true;
        isRunning = false;
      });
  };

  const cancel = () => {
    if (completed) return;
    cancelled = true;
    reject(CANCELED_ERROR);
    taskPromise?.cancel?.();
  };

  return Object.defineProperties(
    { run, cancel },
    {
      isRunning: { get: () => isRunning },
      cancelled: { get: () => cancelled },
    }
  ) as CancelableTask<K, T>;
};
