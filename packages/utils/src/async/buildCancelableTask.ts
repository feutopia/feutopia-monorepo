import "../pollyfill";

// 返回的结果类型
type Result<T> = {
	readonly data?: T;
	readonly error?: Error;
	readonly cancelled: boolean;
};

// 入参 async 函数
type Service<T, K extends any[]> = (...params: K) => Promise<T> & {
	cancel: () => void;
};

// 取消错误
const CANCELED_ERROR = Object.freeze(new Error("PROMISE_CANCELLED"));

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
) => {
	let isCancelled = false;
	let isCompleted = false;
	let servicePromise: ReturnType<Service<T, K>> | null = null;
	const { promise, resolve, reject } = Promise.withResolvers<T>();

	const run = (...params: K): Promise<Result<T>> => {
		if (!isCancelled) {
			servicePromise = service(...params);
			servicePromise
				.then((data) => resolve(data))
				.catch((error) => reject(error));
		}

		return promise
			.then((data) => ({
				data,
				cancelled: false,
			}))
			.catch((error) => {
				const cancelled = error === CANCELED_ERROR;
				return {
					error: cancelled ? undefined : error,
					cancelled,
				};
			})
			.finally(() => {
				isCompleted = true;
			});
	};

	const cancel = () => {
		if (isCompleted) return;
		isCancelled = true;
		reject(CANCELED_ERROR);
		servicePromise?.cancel?.();
	};

	const isCanceled = () => isCancelled;

	return { run, cancel, isCanceled };
};
