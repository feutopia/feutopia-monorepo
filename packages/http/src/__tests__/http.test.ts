import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import axios from "axios";
import { Http, ErrorCode } from "..";
import { fail } from "assert";

// Test helpers
interface MockAxiosOptions {
  requestInterceptor?: (fn: Function) => void;
  responseInterceptor?: (success: Function, error?: Function) => void;
  mockRequest?: Mock;
}

function createMockAxiosInstance({
  requestInterceptor,
  responseInterceptor,
  mockRequest = vi.fn().mockResolvedValue({ data: {} }),
}: MockAxiosOptions = {}) {
  return {
    interceptors: {
      request: {
        use: vi.fn((interceptor) => {
          if (requestInterceptor) requestInterceptor(interceptor);
        }),
      },
      response: {
        use: vi.fn((success, error) => {
          if (responseInterceptor) responseInterceptor(success, error);
        }),
      },
    },
    request: mockRequest,
  };
}

// Mock axios
vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => createMockAxiosInstance()),
  },
}));

describe("Http Client", () => {
  let http: Http;
  let mockRequest: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest = vi.fn().mockResolvedValue({ data: {} });
    (axios.create as any).mockReturnValue(
      createMockAxiosInstance({ mockRequest })
    );
    http = new Http();
  });

  afterEach(() => {
    http.cancelAllRequests();
  });

  describe("Configuration", () => {
    it("should initialize with default options", () => {
      expect(http).toBeInstanceOf(Http);
      expect(axios.create).toHaveBeenCalled();
    });

    it("should handle custom configuration", () => {
      const customConfig = { timeout: 5000 };
      new Http({ config: customConfig });
      expect(axios.create).toHaveBeenCalledWith(customConfig);
    });
  });

  describe("Request Methods", () => {
    describe("GET requests", () => {
      it("should make basic GET request", async () => {
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

      it("should preserve query parameters", async () => {
        let requestInterceptor: Function = () => {};
        const mockAxios = createMockAxiosInstance({
          requestInterceptor: (fn) => (requestInterceptor = fn),
        });

        (axios.create as any).mockReturnValue(mockAxios);
        new Http();

        const config = {
          url: "/test",
          method: "GET",
          params: { foo: "bar" },
        };

        const transformedConfig = await requestInterceptor(config);
        expect(transformedConfig.params).toEqual({ foo: "bar" });
        expect(transformedConfig.data).toBeUndefined();
      });
    });

    describe("POST requests", () => {
      it("should make basic POST request", async () => {
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

      it("should convert params to data for POST requests", async () => {
        let requestInterceptor: Function = () => {};
        const mockAxios = createMockAxiosInstance({
          requestInterceptor: (fn) => (requestInterceptor = fn),
        });

        (axios.create as any).mockReturnValue(mockAxios);
        new Http();

        const config = {
          url: "/test",
          method: "POST",
          params: { foo: "bar" },
        };

        const transformedConfig = await requestInterceptor(config);
        expect(transformedConfig.data).toEqual({ foo: "bar" });
        expect(transformedConfig.params).toBeUndefined();
      });
    });

    describe("PUT requests", () => {
      it("should make basic PUT request", async () => {
        const mockResponse = { data: { message: "success" } };
        mockRequest.mockResolvedValueOnce(mockResponse);

        await http.put({
          url: "/test",
          data: { foo: "bar" },
        });

        expect(mockRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            url: "/test",
            method: "PUT",
            data: { foo: "bar" },
          })
        );
      });

      it("should convert params to data for PUT requests", async () => {
        let requestInterceptor: Function = () => {};
        const mockAxios = createMockAxiosInstance({
          requestInterceptor: (fn) => (requestInterceptor = fn),
        });

        (axios.create as any).mockReturnValue(mockAxios);
        new Http();

        const config = {
          url: "/test",
          method: "PUT",
          params: { foo: "bar" },
        };

        const transformedConfig = await requestInterceptor(config);
        expect(transformedConfig.data).toEqual({ foo: "bar" });
        expect(transformedConfig.params).toBeUndefined();
      });
    });

    describe("DELETE requests", () => {
      it("should make basic DELETE request", async () => {
        const mockResponse = { data: { message: "success" } };
        mockRequest.mockResolvedValueOnce(mockResponse);

        await http.delete({
          url: "/test",
          params: { id: 123 },
        });

        expect(mockRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            url: "/test",
            method: "DELETE",
            params: { id: 123 },
          })
        );
      });

      it("should convert params to data for DELETE requests", async () => {
        let requestInterceptor: Function = () => {};
        const mockAxios = createMockAxiosInstance({
          requestInterceptor: (fn) => (requestInterceptor = fn),
        });

        (axios.create as any).mockReturnValue(mockAxios);
        new Http();

        const config = {
          url: "/test",
          method: "DELETE",
          params: { id: 123 },
        };

        const transformedConfig = await requestInterceptor(config);
        expect(transformedConfig.data).toEqual({ id: 123 });
        expect(transformedConfig.params).toBeUndefined();
      });
    });

    describe("PATCH requests", () => {
      it("should make basic PATCH request", async () => {
        const mockResponse = { data: { message: "success" } };
        mockRequest.mockResolvedValueOnce(mockResponse);

        await http.patch({
          url: "/test",
          data: { status: "active" },
        });

        expect(mockRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            url: "/test",
            method: "PATCH",
            data: { status: "active" },
          })
        );
      });

      it("should convert params to data for PATCH requests", async () => {
        let requestInterceptor: Function = () => {};
        const mockAxios = createMockAxiosInstance({
          requestInterceptor: (fn) => (requestInterceptor = fn),
        });

        (axios.create as any).mockReturnValue(mockAxios);
        new Http();

        const config = {
          url: "/test",
          method: "PATCH",
          params: { status: "active" },
        };

        const transformedConfig = await requestInterceptor(config);
        expect(transformedConfig.data).toEqual({ status: "active" });
        expect(transformedConfig.params).toBeUndefined();
      });
    });

    describe("Request headers", () => {
      it("should include custom headers in request", async () => {
        const customHeaders = {
          "X-Custom-Header": "custom-value",
          Authorization: "Bearer token",
        };

        await http.get({
          url: "/test",
          headers: customHeaders,
        });

        expect(mockRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            headers: expect.objectContaining(customHeaders),
          })
        );
      });
    });

    describe("Request timeout", () => {
      it("should respect custom timeout settings", async () => {
        const customTimeout = 5000;

        await http.get({
          url: "/test",
          timeout: customTimeout,
        });

        expect(mockRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            timeout: customTimeout,
          })
        );
      });
    });
  });

  describe("Request Handling", () => {
    describe("Request Interceptors", () => {
      it("should execute interceptors in correct order", async () => {
        const order: string[] = [];

        let requestInterceptors: Function[] = [];

        // Create mock axios with interceptor handling
        const mockAxios = createMockAxiosInstance({
          requestInterceptor: (fn) => requestInterceptors.push(fn),
          mockRequest: vi.fn().mockImplementation(async (config) => {
            // Execute all interceptors in order
            let currentConfig = config;
            for (const interceptor of requestInterceptors) {
              currentConfig = await interceptor(currentConfig);
            }
            return { data: {} };
          }),
        });

        (axios.create as any).mockReturnValue(mockAxios);
        const http = new Http();

        http.getInterceptors().request.use((config) => {
          order.push("first");
          return config;
        });

        http.getInterceptors().request.use((config) => {
          order.push("second");
          return config;
        });

        await http.get({ url: "/test" });

        expect(order[0]).toBe("first");
        expect(order[1]).toBe("second");
        expect(order.length).toBe(2);
      });
    });

    describe("Response Interceptors", () => {
      it("should handle successful responses", async () => {
        const mockResponse = { data: { success: true } };
        mockRequest.mockResolvedValueOnce(mockResponse);

        const response = await http.get({ url: "/test" });
        expect(response.data).toEqual({ success: true });
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const mockError = { code: ErrorCode.NETWORK_ERROR };
      mockRequest.mockRejectedValueOnce(mockError);

      try {
        await http.get({ url: "/test" });
        fail("Should have thrown network error");
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
      }
    });

    it("should handle malformed response data", async () => {
      const malformedData = "invalid json";
      mockRequest.mockResolvedValueOnce({ data: malformedData });

      const response = await http.get({ url: "/test" });
      expect(response.data).toBe(malformedData);
    });

    it("should handle missing response data", async () => {
      mockRequest.mockResolvedValueOnce({});

      const result = await http.get({ url: "/test" });
      expect(result.data).toBeUndefined();
    });
  });

  describe("File Operations", () => {
    describe("Upload", () => {
      it("should handle file upload with progress", async () => {
        const mockFile = new File(["test"], "test.txt");
        const onProgress = vi.fn();
        const onUploadComplete = vi.fn();
        const mockResponse = { data: { url: "https://example.com/file" } };

        mockRequest.mockImplementationOnce(async (config: any) => {
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
    });

    describe("Download", () => {
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

        const link = { click: vi.fn(), href: "", download: "" };
        vi.spyOn(document, "createElement").mockReturnValue(link as any);
        vi.spyOn(document.body, "appendChild").mockImplementation(
          (node) => node
        );
        vi.spyOn(document.body, "removeChild").mockImplementation(
          (node) => node
        );

        await http.download({ url: "/download" });

        expect(createObjectURL).toHaveBeenCalled();
        expect(link.click).toHaveBeenCalled();
        expect(revokeObjectURL).toHaveBeenCalled();
      });
    });
  });

  describe("Cancellation", () => {
    it("should handle request cancellation", async () => {
      const controller = new AbortController();

      mockRequest.mockImplementationOnce(async (config) => {
        // 等待一个微任务，让 abort() 有机会执行
        await Promise.resolve();
        // 如果请求被取消，抛出取消错误
        if (config.signal?.aborted) {
          const error: any = new Error("Request aborted");
          error.code = ErrorCode.CANCELED;
          throw error;
        }
        return { data: {} };
      });

      const request = http.get({
        url: "/test",
        signal: controller.signal,
      });

      controller.abort();

      try {
        await request;
        fail("Should have thrown cancellation error");
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.CANCELED);
      }
    });

    it("should cancel all pending requests", async () => {
      mockRequest.mockImplementationOnce(async (config) => {
        // 等待一个微任务，让 abort() 有机会执行
        await Promise.resolve();
        // 如果请求被取消，抛出取消错误
        if (config.signal?.aborted) {
          const error: any = new Error("Request aborted");
          error.code = ErrorCode.CANCELED;
          throw error;
        }
        return { data: {} };
      });

      const requests = [
        http.get({ url: "/test1" }),
        http.get({ url: "/test2" }),
      ];

      http.cancelAllRequests();

      try {
        await Promise.all(requests);
        fail("Should have thrown cancellation error");
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.CANCELED);
      }
    });

    it("should cancel request using Http instance cancel method", async () => {
      mockRequest.mockImplementationOnce(async (config) => {
        await Promise.resolve();
        if (config.signal?.aborted) {
          const error: any = new Error("Request aborted");
          error.code = ErrorCode.CANCELED;
          throw error;
        }
        return { data: {} };
      });

      const request = http.get({
        url: "/test",
      });

      request.cancel();

      try {
        await request;
        fail("Should have thrown cancellation error");
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.CANCELED);
      }
    });

    it("should not affect other requests when canceling specific request", async () => {
      const mockResponse = { data: { success: true } };

      mockRequest
        .mockImplementationOnce(async (config) => {
          await Promise.resolve();
          if (config.signal?.aborted) {
            const error: any = new Error("Request aborted");
            error.code = ErrorCode.CANCELED;
            throw error;
          }
          return { data: {} };
        })
        .mockImplementationOnce(() => Promise.resolve(mockResponse));

      const request1 = http.get({
        url: "/test1",
      });

      const request2 = http.get({
        url: "/test2",
      });

      request1.cancel();

      try {
        await request1;
        fail("Request 1 should have been canceled");
      } catch (error: any) {
        expect(error.code).toBe(ErrorCode.CANCELED);
      }

      const response2 = await request2;
      expect(response2).toEqual(mockResponse);
    });
  });
});
