import { describe, it, expect } from "vitest";
import "../promise-with-resolvers";

describe("Promise.withResolvers", () => {
	it("should create a promise with resolve and reject functions", async () => {
		const { promise, resolve, reject } = Promise.withResolvers<number>();

		expect(promise).toBeInstanceOf(Promise);
		expect(typeof resolve).toBe("function");
		expect(typeof reject).toBe("function");
	});

	it("should resolve the promise with the provided value", async () => {
		const { promise, resolve } = Promise.withResolvers<number>();
		resolve(42);

		const result = await promise;
		expect(result).toBe(42);
	});

	it("should reject the promise with the provided reason", async () => {
		const { promise, reject } = Promise.withResolvers<number>();
		const error = new Error("Test error");
		reject(error);

		try {
			await promise;
			// Should not reach here
			expect(true).toBe(false);
		} catch (e) {
			expect(e).toBe(error);
		}
	});

	it("should work with async/await", async () => {
		const { promise, resolve } = Promise.withResolvers<string>();

		setTimeout(() => {
			resolve("async result");
		}, 100);

		const result = await promise;
		expect(result).toBe("async result");
	});
});
