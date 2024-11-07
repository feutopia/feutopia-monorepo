interface PromiseWithResolvers<T> {
	promise: Promise<T>;
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;
}

if (!Promise.withResolvers) {
	/**
	 * 创建一个带有解析器和拒绝器的 Promise
	 * @param T - Promise 的类型
	 * @returns 带有解析器和拒绝器的 Promise
	 */
	Promise.withResolvers = function <T>(): PromiseWithResolvers<T> {
		let resolve!: (value: T | PromiseLike<T>) => void;
		let reject!: (reason?: any) => void;
		const promise = new Promise<T>((res, rej) => {
			resolve = res;
			reject = rej;
		});
		return { promise, resolve, reject };
	};
}

// 使这个文件成为一个模块
export {};
