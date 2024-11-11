import { describe, it, expect } from "vitest";
import {
	ResponseHandler,
	RequestHandler,
	ErrorHandler,
	HttpResponse,
	HttpRequestConfig,
	HttpError,
	BaseHttpOptions,
	UploadRequestConfig,
	ErrorCode,
} from "../core/types";
import { AxiosHeaders } from "axios";

describe("HTTP Types", () => {
	describe("Handlers", () => {
		it("should have correct ResponseHandler structure", async () => {
			const handler: ResponseHandler<string> = {
				handle: async (response: HttpResponse) => "processed",
			};
			const result = await handler.handle({ data: "test" } as HttpResponse);
			expect(result).toBe("processed");
		});

		it("should have correct RequestHandler structure", async () => {
			const handler: RequestHandler = {
				handle: async (config: HttpRequestConfig) => config,
			};
			const config = { url: "/test" };
			const result = await handler.handle(config);
			expect(result).toEqual(config);
		});

		it("should have correct ErrorHandler structure", () => {
			const handler: ErrorHandler = {
				handle: (error: HttpError) => {},
			};
			expect(typeof handler.handle).toBe("function");
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
				onProgress: (percentage) => {},
				onUploadComplete: (response) => {},
				onUploadError: (error) => {},
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
		it("should have correct BaseHttpOptions structure", () => {
			const options: BaseHttpOptions = {
				config: {
					baseURL: "https://api.example.com",
					timeout: 5000,
					showError: true,
				},
				responseHandler: {
					handle: async (response) => response,
				},
			};

			expect(options).toHaveProperty("config");
			expect(options).toHaveProperty("responseHandler");
		});
	});
});
