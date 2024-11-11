import {
	describe,
	it,
	expect,
	vi,
	beforeEach,
	afterEach,
	Mock,
	vitest,
} from "vitest";
import axios from "axios";
import {
	ErrorCode,
	ErrorHandler,
	RequestHandler,
	ResponseHandler,
} from "../core/types";
import { TestHttp } from "./test-http";
import { fail } from "assert";

// Mock axios
vi.mock("axios", () => {
	return {
		default: {
			create: vi.fn(() => ({
				// 模拟 axios.create() 返回的实例
				interceptors: {
					request: { use: vi.fn() }, // 模拟 instance.interceptors.request.use()
					response: { use: vi.fn() }, // 模拟 instance.interceptors.response.use()
				},
				// 模拟 instance.request()
				request: vi // 模拟 instance.request()
					.fn()
					.mockImplementation(() => Promise.resolve({ data: {} })),
			})),
		},
	};
});

describe("BaseHttp", () => {
	let http: TestHttp;
	let mockRequest: Mock<(...args: any[]) => Promise<any>>;

	beforeEach(() => {
		vi.clearAllMocks();
		// 创建新的 mock request 函数
		mockRequest = vi
			.fn()
			.mockImplementation(() => Promise.resolve({ data: {} }));
		// 更新 axios.create 的实现
		(axios.create as any).mockReturnValue({
			interceptors: {
				request: { use: vi.fn() },
				response: { use: vi.fn() },
			},
			request: mockRequest,
		});
		http = new TestHttp();
	});

	afterEach(() => {
		http.cancelAllRequests();
	});

	describe("Basic HTTP Methods", () => {
		it("should make GET request", async () => {
			const mockResponse = { data: { message: "success" } };
			mockRequest.mockResolvedValueOnce(mockResponse);

			await http.get({
				url: "/test",
				params: { foo: "bar" },
			});
			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: "/test",
					params: { foo: "bar" },
				})
			);
		});

		it("should make POST request", async () => {
			const mockResponse = { data: { message: "success" } };
			mockRequest.mockResolvedValueOnce(mockResponse);

			await http.post({
				url: "/test",
				data: { foo: "bar" },
			});
			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: "/test",
					method: "POST",
					data: { foo: "bar" },
				})
			);
		});
	});

	describe("Request Handlers", () => {
		it("should use custom request handler", async () => {
			// 创建一个 spy 函数作为请求处理器的 handle 方法
			const handleSpy = vi.fn();

			// 定义自定义请求处理器
			const customHandler: RequestHandler = {
				handle: handleSpy,
			};

			// 声明拦截器变量
			let requestInterceptor: Function = () => {};

			// 重新设置请求模拟函数
			mockRequest = vi
				.fn()
				.mockImplementation(() => Promise.resolve({ data: {} }));

			// 创建模拟的 axios 实例
			const mockAxios = {
				interceptors: {
					request: {
						use: vi.fn((interceptor) => {
							requestInterceptor = interceptor;
						}),
					},
					response: {
						use: vi.fn(),
					},
				},
				request: mockRequest,
			};

			// 配置 axios.create 返回模拟实例
			(axios.create as any).mockReturnValue(mockAxios);

			// 创建测试用的 HTTP 实例，传入自定义请求处理器
			const httpWithHandler = new TestHttp({
				requestHandler: customHandler,
			});

			// 创建模拟的请求配置
			const mockConfig = {
				url: "/test",
				method: "GET",
			};

			// 发起请求
			await httpWithHandler.get({ url: "/test" });

			// 手动触发请求拦截器
			if (requestInterceptor) {
				await requestInterceptor(mockConfig);
			}

			// 验证自定义请求处理器是否被正确调用
			expect(handleSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					url: "/test",
				})
			);
		});
	});

	describe("Request Interceptors", () => {
		it("should keep params for GET requests", async () => {
			let requestInterceptor: Function = () => {};

			const mockAxios = {
				interceptors: {
					request: {
						use: vi.fn((interceptor) => {
							requestInterceptor = interceptor;
						}),
					},
					response: { use: vi.fn() },
				},
				request: mockRequest,
			};

			(axios.create as any).mockReturnValue(mockAxios);
			new TestHttp();

			const config = {
				url: "/test",
				method: "GET",
				params: { foo: "bar" },
			};

			const transformedConfig = await requestInterceptor(config);
			expect(transformedConfig.params).toEqual({ foo: "bar" });
			expect(transformedConfig.data).toBeUndefined();
		});

		it("should move params to data for non-GET requests", async () => {
			let requestInterceptor: Function = () => {};

			const mockAxios = {
				interceptors: {
					request: {
						use: vi.fn((interceptor) => {
							requestInterceptor = interceptor;
						}),
					},
					response: { use: vi.fn() },
				},
				request: mockRequest,
			};

			(axios.create as any).mockReturnValue(mockAxios);
			new TestHttp();

			// Test POST request with params
			const config = {
				url: "/test",
				method: "POST",
				params: { foo: "bar" },
			};

			// Trigger the request interceptor manually
			const transformedConfig = await requestInterceptor(config);
			// Verify params were moved to data and original params were deleted
			expect(transformedConfig.data).toEqual({ foo: "bar" });
			expect(transformedConfig.params).toBeUndefined();
		});
	});

	describe("Request Cancellation", () => {
		it("should handle external AbortController", async () => {
			const controller = new AbortController();
			const request = http.get({
				url: "/test",
				signal: controller.signal,
			});

			controller.abort();

			try {
				await request;
			} catch (error: any) {
				expect(error.code).toBe(ErrorCode.CANCELED);
			}
		});

		it("should cleanup request controller after request completion", async () => {
			const request = http.get({ url: "/test" });
			await request;

			// @ts-ignore - accessing private property for testing
			expect(http.requestControllers.size).toBe(0);
		});
	});

	describe("Response Handler", () => {
		it("should use custom response handler", async () => {
			// 创建一个 spy 函数作为响应处理器的 handle 方法
			const handleSpy = vi
				.fn()
				.mockResolvedValue({ customData: "transformed" }); // 模拟处理后返回转换后的数据

			// 定义一个自定义响应处理器，实现 ResponseHandler 接口
			const customHandler: ResponseHandler = {
				handle: handleSpy,
			};

			// 声明拦截器变量，用于后续存储和访问拦截器函数
			let requestInterceptor: Function = () => {}; // 请求拦截器
			let responseInterceptor: Function = () => {}; // 响应拦截器
			let responseErrorInterceptor: Function = () => {}; // 响应错误拦截器

			// 重新设置请求模拟函数
			mockRequest = vi
				.fn()
				.mockImplementation(() => Promise.resolve({ data: {} }));

			// 创建模拟的 axios 实例，包含拦截器配置
			const mockAxios = {
				interceptors: {
					request: {
						// 请求拦截器配置，当使用时保存拦截器函数
						use: vi.fn((interceptor) => {
							requestInterceptor = interceptor;
						}),
					},
					response: {
						// 响应拦截器配置，当使用时保存成功和错误处理函数
						use: vi.fn((interceptor, error) => {
							responseInterceptor = interceptor;
							responseErrorInterceptor = error;
						}),
					},
				},
				request: mockRequest,
			};

			// 配置 axios.create 返回上面创建的模拟实例
			(axios.create as any).mockReturnValue(mockAxios);

			// 创建测试用的 HTTP 实例，传入自定义响应处理器
			const httpWithHandler = new TestHttp({
				responseHandler: customHandler,
			});

			// 创建模拟的响应数据
			const mockResponse = {
				data: { message: "success" },
				status: 200,
				statusText: "OK",
				headers: {},
				config: {} as any,
			};
			// 配置模拟请求返回上述响应
			mockRequest.mockResolvedValueOnce(mockResponse);

			// 发起 GET 请求
			await httpWithHandler.get({ url: "/test" });

			// 手动触发响应拦截器，模拟响应处理过程
			if (responseInterceptor) {
				await responseInterceptor(mockResponse);
			}

			// 验证自定义响应处理器是否被正确调用，并且接收到预期的参数
			expect(handleSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					data: { message: "success" },
					status: 200,
					statusText: "OK",
				})
			);
		});
	});

	describe("Response Interceptors", () => {
		it("should handle blob response without transformation", async () => {
			let responseInterceptor: Function = () => {};
			const mockBlob = new Blob(["test"], { type: "text/plain" });

			const mockAxios = {
				interceptors: {
					request: { use: vi.fn() },
					response: {
						use: vi.fn((interceptor) => {
							responseInterceptor = interceptor;
						}),
					},
				},
				request: mockRequest,
			};

			(axios.create as any).mockReturnValue(mockAxios);
			new TestHttp();

			const mockResponse = {
				data: mockBlob,
				config: {
					responseType: "blob",
				},
			};

			// Trigger the response interceptor manually
			const result = await responseInterceptor(mockResponse);

			// Verify blob responses are returned without transformation
			expect(result).toBe(mockResponse);
		});

		it("should use response handler for non-blob responses", async () => {
			let responseInterceptor: Function = () => {};
			const handleSpy = vi.fn().mockReturnValue({ transformed: true });

			const mockAxios = {
				interceptors: {
					request: { use: vi.fn() },
					response: {
						use: vi.fn((interceptor) => {
							responseInterceptor = interceptor;
						}),
					},
				},
				request: mockRequest,
			};

			(axios.create as any).mockReturnValue(mockAxios);
			new TestHttp({
				responseHandler: {
					handle: handleSpy,
				},
			});

			const mockResponse = {
				data: { original: true },
				config: {
					responseType: "json",
				},
			};

			// Trigger the response interceptor manually
			await responseInterceptor(mockResponse);

			// Verify response handler was called for non-blob response
			expect(handleSpy).toHaveBeenCalledWith(mockResponse);
		});
	});

	describe("Error Handlers", () => {
		it("should use custom error handler", async () => {
			// 创建一个 spy 函数作为错误处理器的 handle 方法
			const handleSpy = vi.fn();

			// 定义自定义错误处理器
			const customHandler: ErrorHandler = {
				handle: handleSpy,
			};

			const mockError = {
				code: ErrorCode.NETWORK_ERROR,
				config: {
					url: "/test",
				},
			};

			// 重新设置请求模拟函数
			mockRequest = vi.fn().mockRejectedValue(mockError);

			// 创建一个响应拦截器的 mock 实现
			let responseErrorInterceptor: Function = () => {};

			const mockAxios = {
				interceptors: {
					request: {
						use: vi.fn(),
					},
					response: {
						use: vi.fn((_, error) => {
							responseErrorInterceptor = error;
						}),
					},
				},
				// 直接让请求抛出错误
				request: mockRequest,
			};

			(axios.create as any).mockReturnValue(mockAxios);

			const httpWithHandler = new TestHttp({
				errorHandler: customHandler,
			});

			try {
				await httpWithHandler.get({ url: "/test" });
			} catch (error) {
				if (responseErrorInterceptor) {
					await responseErrorInterceptor(error);
				}
				// 验证错误处理器是否被调用
				expect(handleSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						code: ErrorCode.NETWORK_ERROR,
						config: expect.objectContaining({
							url: "/test",
						}),
					})
				);
			}
		});

		it("should not call error handler when request is cancelled", async () => {
			const handleSpy = vi.fn();
			const errorHandler: ErrorHandler = {
				handle: handleSpy,
			};

			// 重新设置请求模拟函数
			mockRequest = vi.fn().mockRejectedValue({ code: ErrorCode.CANCELED });

			const httpWithHandler = new TestHttp({
				errorHandler,
			});

			try {
				await httpWithHandler.get({ url: "/test" });
			} catch (error) {
				// 验证错误处理器没有被调用
				expect(handleSpy).not.toHaveBeenCalled();
			}
		});
	});

	describe("Upload Functionality", () => {
		it("should handle file upload with progress", async () => {
			const mockFile = new File(["test"], "test.txt");
			const onProgress = vi.fn();
			const onUploadComplete = vi.fn();
			const mockResponse = { data: { url: "https://example.com/file" } };

			mockRequest.mockImplementationOnce(async (config: any) => {
				// Simulate upload progress
				if (config.onUploadProgress) {
					config.onUploadProgress({ loaded: 50, total: 100 });
				}
				return mockResponse;
			});

			await http.upload({
				url: "/upload",
				data: mockFile,
				onProgress,
				onUploadComplete,
			});

			expect(onProgress).toHaveBeenCalledWith(50);
			expect(onUploadComplete).toHaveBeenCalledWith(mockResponse);
		});
		it("should handle FormData input directly", async () => {
			const formData = new FormData();
			formData.append("key", "value");

			await http.upload({
				url: "/upload",
				data: formData,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.any(FormData),
					headers: { "Content-Type": "multipart/form-data" },
				})
			);
		});

		it("should handle upload error correctly", async () => {
			const mockError = new Error("Upload failed");
			const onUploadError = vi.fn();

			mockRequest.mockRejectedValueOnce(mockError);

			try {
				await http.upload({
					url: "/upload",
					data: new File([""], "test.txt"),
					onUploadError,
				});
			} catch (error) {
				// 验证错误处理回调被调用
				expect(onUploadError).toHaveBeenCalledWith(mockError);
				// 验证抛出的错误
				expect(error).toBe(mockError);
			}
		});
	});

	describe("Download Functionality", () => {
		it("should handle file download", async () => {
			const mockBlob = new Blob(["test"], { type: "text/plain" });
			const mockResponse = {
				data: mockBlob,
				headers: {
					"content-type": "text/plain",
					"content-disposition": 'attachment; filename="test.txt"',
				},
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			// Mock DOM APIs
			const createObjectURL = vi.fn();
			const revokeObjectURL = vi.fn();
			Object.defineProperty(window, "URL", {
				value: { createObjectURL, revokeObjectURL },
			});

			const link = {
				click: vi.fn(),
				href: "",
				download: "",
			};
			vi.spyOn(document, "createElement").mockReturnValue(link as any);
			vi.spyOn(document.body, "appendChild").mockImplementation((node) => node);
			vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);

			await http.download({ url: "/download" });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: "/download",
					responseType: "blob",
				})
			);
			expect(createObjectURL).toHaveBeenCalled();
			expect(link.click).toHaveBeenCalled();
			expect(revokeObjectURL).toHaveBeenCalled();
		});
		it("should handle download errors gracefully", async () => {
			const mockError = new Error("Download failed");
			mockRequest.mockRejectedValueOnce(mockError);

			try {
				await http.download({ url: "/download" });
			} catch (error) {
				expect(error).toBe(mockError);
			}
		});

		it("should extract filename correctly from various content-disposition formats", async () => {
			const mockResponse = {
				data: new Blob(),
				headers: {
					"content-type": "application/pdf",
					"content-disposition": 'attachment; filename="test file.pdf"',
				},
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			// Mock DOM APIs as before
			const link = {
				click: vi.fn(),
				href: "",
				download: "",
			};
			vi.spyOn(document, "createElement").mockReturnValue(link as any);

			await http.download({ url: "/download" });

			expect(link.download).toBe("test file.pdf");
		});
	});

	describe("Error Handling", () => {
		it("should handle network errors", async () => {
			const mockError = {
				code: ErrorCode.NETWORK_ERROR,
				message: "Network Error",
			};

			mockRequest.mockRejectedValueOnce(mockError);

			try {
				await http.get({ url: "/test" });
			} catch (error: any) {
				expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
			}
		});

		it("should handle timeout errors", async () => {
			const mockError = {
				code: ErrorCode.TIMEOUT,
				message: "Timeout",
			};

			mockRequest.mockRejectedValueOnce(mockError);

			try {
				await http.get({ url: "/test" });
			} catch (error: any) {
				expect(error.code).toBe(ErrorCode.TIMEOUT);
			}
		});
	});

	it("should handle concurrent requests independently", async () => {
		const requests = [
			http.get({ url: "/test1" }),
			http.get({ url: "/test2" }),
			http.get({ url: "/test3" }),
		];

		await Promise.all(requests);

		expect(mockRequest).toHaveBeenCalledTimes(3);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ url: "/test1" })
		);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ url: "/test2" })
		);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ url: "/test3" })
		);
	});

	it("should handle request timeout", async () => {
		mockRequest.mockImplementationOnce(
			() =>
				new Promise((_, reject) => {
					setTimeout(() => {
						reject({ code: ErrorCode.TIMEOUT, message: "Request timed out" });
					}, 100);
				})
		);

		try {
			await http.get({
				url: "/test",
				timeout: 50, // 50ms timeout
			});
			fail("Should have thrown timeout error");
		} catch (error: any) {
			expect(error.code).toBe(ErrorCode.TIMEOUT);
		}
	});

	it("should handle different HTTP status codes appropriately", async () => {
		const errorResponses = [
			{ status: 400, data: { message: "Bad Request" } },
			{ status: 401, data: { message: "Unauthorized" } },
			{ status: 403, data: { message: "Forbidden" } },
			{ status: 404, data: { message: "Not Found" } },
			{ status: 500, data: { message: "Server Error" } },
		];

		for (const response of errorResponses) {
			mockRequest.mockRejectedValueOnce({
				response,
				code: ErrorCode.SERVER_ERROR,
			});

			try {
				await http.get({ url: "/test" });
				fail(`Should have thrown error for status ${response.status}`);
			} catch (error: any) {
				expect(error.response.status).toBe(response.status);
			}
		}
	});

	it("should handle request transformation correctly", async () => {
		// 声明拦截器变量
		let requestInterceptor: Function = () => {};

		// 创建模拟的 axios 实例
		const mockAxios = {
			interceptors: {
				request: {
					use: vi.fn((interceptor) => {
						requestInterceptor = interceptor;
					}),
				},
				response: { use: vi.fn() },
			},
			request: mockRequest,
		};

		// 配置 axios.create 返回模拟实例
		(axios.create as any).mockReturnValue(mockAxios);

		const requestHandler: RequestHandler = {
			handle: (config) => ({
				...config,
				headers: {
					...config.headers,
					"X-Custom-Header": "test-value",
				},
			}),
		};

		const httpWithTransform = new TestHttp({ requestHandler });

		// 创建模拟的请求配置
		const mockConfig = {
			url: "/test",
			method: "GET",
		};

		// 发起请求
		await httpWithTransform.get({ url: "/test" });

		// 手动触发请求拦截器
		if (requestInterceptor) {
			const transformedConfig = await requestInterceptor(mockConfig);

			// 验证转换后的配置包含预期的头部
			expect(transformedConfig).toEqual(
				expect.objectContaining({
					headers: expect.objectContaining({
						"X-Custom-Header": "test-value",
					}),
				})
			);
		}
	});
});
