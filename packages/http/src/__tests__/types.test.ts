import { describe, it, expect } from "vitest";
import {
	ResponseHandler,
	RequestHandler,
	HttpResponse,
	HttpRequestConfig,
	HttpError,
	HttpClientOptions,
	UploadRequestConfig,
	ErrorHandler,
	CancellablePromise,
} from "../core/types";
import { AxiosHeaders } from "axios";
import { ErrorCode } from "../core/enums";

describe("HTTP Types", () => {
	describe("Handlers", () => {
		it("should have correct ResponseHandler structure", async () => {
			const handler: ResponseHandler<string> = async (
				_response: HttpResponse
			) => "processed";
			const result = await handler({ data: "test" } as HttpResponse);
			expect(result).toBe("processed");
		});

		it("should have correct RequestHandler structure", async () => {
			const handler: RequestHandler = async (config: HttpRequestConfig) =>
				config;
			const config = { url: "/test" };
			const result = await handler(config);
			expect(result).toEqual(config);
		});
		it("should handle sync ResponseHandler", () => {
			const handler: ResponseHandler<number> = (_response: HttpResponse) => 42;
			const result = handler({ data: "test" } as HttpResponse);
			expect(result).toBe(42);
		});

		it("should handle ErrorHandler", async () => {
			const handler: ErrorHandler = async (_error: HttpError) => {
				// Handle error
			};
			const error: HttpError = {
				name: "Error",
				message: "Test error",
				code: ErrorCode.NETWORK_ERROR,
				isAxiosError: true,
				toJSON: () => ({}),
			};
			await expect(handler(error)).resolves.toBeUndefined();
		});
	});

	describe("CancellablePromise", () => {
		it("should have cancel method", async () => {
			const promise: CancellablePromise<number> = Object.assign(
				Promise.resolve(42),
				{ cancel: () => {} }
			);

			expect(typeof promise.cancel).toBe("function");
			await expect(promise).resolves.toBe(42);
		});
	});

	describe("ResponseType", () => {
		it("should handle different response types", async () => {
			// Test with default response
			type DefaultResponse = { raw: boolean };
			const response: HttpResponse<DefaultResponse> = {
				data: { raw: true },
				status: 200,
				statusText: "OK",
				headers: {},
				config: {} as any,
			};

			expect(response.data.raw).toBe(true);
		});
	});

	describe("Request and Response Types", () => {
		it("should have correct HttpRequestConfig structure", () => {
			const config: HttpRequestConfig = {
				url: "/test",
				method: "GET",
				baseURL: "https://api.example.com",
				headers: { "Content-Type": "application/json" },
				params: { id: 1 },
				data: { name: "test" },
				timeout: 5000,
				showError: true,
			};

			expect(config).toHaveProperty("url");
			expect(config).toHaveProperty("method");
			expect(config).toHaveProperty("showError");
		});

		it("should have correct HttpResponse structure", () => {
			const response: HttpResponse<{ id: number }> = {
				data: { id: 1 },
				status: 200,
				statusText: "OK",
				headers: {},
				config: {} as any,
			};

			expect(response).toHaveProperty("data");
			expect(response.data).toHaveProperty("id");
		});
	});

	describe("Upload Types", () => {
		it("should have correct UploadRequestConfig structure", () => {
			const config: UploadRequestConfig = {
				url: "/upload",
				onProgress: () => {},
				onUploadComplete: () => {},
				onUploadError: () => {},
			};

			expect(typeof config.onProgress).toBe("function");
			expect(typeof config.onUploadComplete).toBe("function");
			expect(typeof config.onUploadError).toBe("function");
		});
	});

	describe("Error Types", () => {
		it("should have correct ErrorCode values", () => {
			expect(ErrorCode.NETWORK_ERROR).toBe("ERR_NETWORK");
			expect(ErrorCode.TIMEOUT).toBe("ECONNABORTED");
			expect(ErrorCode.CANCELED).toBe("ERR_CANCELED");
			expect(ErrorCode.SERVER_ERROR).toBe("ERR_BAD_RESPONSE");
			expect(ErrorCode.REQUEST_ERROR).toBe("ERR_BAD_REQUEST");
		});

		it("should have correct HttpError structure", () => {
			const error: HttpError = {
				name: "Error",
				message: "Test error",
				code: ErrorCode.NETWORK_ERROR,
				config: {
					url: "/test",
					headers: {} as AxiosHeaders, // Add required headers property
				},
				isAxiosError: true,
				toJSON: () => ({}),
			};

			expect(error).toHaveProperty("code");
			expect(error).toHaveProperty("config");
			expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
		});
	});

	describe("BaseHttpOptions", () => {
		it("should have correct HttpClientOptions structure", () => {
			const options: HttpClientOptions = {
				config: {
					baseURL: "https://api.example.com",
					timeout: 5000,
					showError: true,
				},
				responseHandler: async (response) => response,
			};

			expect(options).toHaveProperty("config");
			expect(options).toHaveProperty("responseHandler");
		});
	});
});
