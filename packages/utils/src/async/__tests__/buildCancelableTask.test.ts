import { describe, it, expect, vi } from "vitest";
import { buildCancelableTask } from "../buildCancelableTask";

describe("buildCancelableTask", () => {
	it("should resolve with data when task completes successfully", async () => {
		const mockData = { foo: "bar" };
		const mockService = vi.fn().mockResolvedValue(mockData);
		const cancelFn = vi.fn();
		const mockServiceWithCancel = Object.assign(mockService, {
			cancel: cancelFn,
		});

		const task = buildCancelableTask(mockServiceWithCancel);
		const result = await task.run();

		expect(result).toEqual({
			data: mockData,
			cancelled: false,
		});
		expect(mockService).toHaveBeenCalled();
	});

	it("should handle rejection with error", async () => {
		const mockError = new Error("Test error");
		const mockService = vi.fn().mockRejectedValue(mockError);
		const cancelFn = vi.fn();
		const mockServiceWithCancel = Object.assign(mockService, {
			cancel: cancelFn,
		});

		const task = buildCancelableTask(mockServiceWithCancel);
		const result = await task.run();

		expect(result).toEqual({
			error: mockError,
			cancelled: false,
		});
	});

	it("should handle cancellation", async () => {
		const mockService = vi.fn().mockImplementation(
			() =>
				new Promise((resolve) => {
					setTimeout(resolve, 1000);
				})
		);
		const cancelFn = vi.fn();
		const mockServiceWithCancel = Object.assign(mockService, {
			cancel: cancelFn,
		});

		const task = buildCancelableTask(mockServiceWithCancel);
		const resultPromise = task.run();
		task.cancel();

		const result = await resultPromise;
		expect(result).toEqual({
			cancelled: true,
		});
		expect(task.isCanceled()).toBe(true);
	});

	it("should pass parameters to service function", async () => {
		const mockService = vi.fn().mockResolvedValue("result");
		const cancelFn = vi.fn();
		const mockServiceWithCancel = Object.assign(mockService, {
			cancel: cancelFn,
		});

		const task = buildCancelableTask(mockServiceWithCancel);
		await task.run("param1", 123);

		expect(mockService).toHaveBeenCalledWith("param1", 123);
	});
});
