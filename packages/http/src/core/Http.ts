import axios, { AxiosInstance } from "axios";
import {
  HttpOptions,
  HttpRequest,
  UploadHttpRequest,
  BaseHttpResponse,
  HttpResponse,
} from "./types";

const noop = () => {};

export class Http {
  #instance: AxiosInstance;
  #requestControllers = new Set<AbortController>();

  constructor(options: HttpOptions = {}) {
    this.#instance = axios.create(options.config || {});
    this.#setupInterceptors();
  }

  // 获取 axios 实例的拦截器
  get interceptors() {
    return this.#instance.interceptors;
  }

  #setupInterceptors(): void {
    this.#instance.interceptors.request.use(
      (config) => {
        const isGet = config.method?.toUpperCase() === "GET";
        const newConfig = {
          ...config,
        };
        if (!isGet && newConfig.params) {
          newConfig.data = newConfig.params;
          delete newConfig.params;
        }
        return newConfig;
      },
      (error) => Promise.reject(error)
    );
  }

  #request<T = any>(config: HttpRequest): HttpResponse<T> {
    const getRequestOptions = (config: HttpRequest) => {
      if (!config.signal) {
        const controller = new AbortController();
        this.#requestControllers.add(controller);
        return {
          config: { ...config, signal: controller.signal },
          cancel: () => controller.abort(),
          removeController: () => this.#requestControllers.delete(controller),
        };
      }
      return { config, cancel: () => {}, removeController: () => {} };
    };
    const {
      config: newConfig,
      cancel,
      removeController,
    } = getRequestOptions(config);

    const promise = this.#instance.request(newConfig);

    // 虽然不影响结果，但添加 catch 防止控制台抛出未捕获的错误
    promise.catch(noop).finally(removeController);

    return Object.assign(promise, {
      cancel,
    });
  }

  upload<T = any>(options: UploadHttpRequest) {
    const { onProgress, ...otherOptions } = options;
    otherOptions.data = this.#createFormData(otherOptions.data);
    return this.#request<T>({
      ...otherOptions,
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        }
      },
    });
  }

  download<T extends Blob>(options: HttpRequest) {
    const promise = this.#request<T>({
      ...options,
      responseType: "blob",
    });
    promise
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = this.#getFilenameFromResponse(response) || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(noop); // 虽然不影响结果，但添加 catch 防止控制台抛出未捕获的错误

    return promise;
  }

  // 取消当前实例所有请求
  cancelAllRequests(): void {
    for (const controller of this.#requestControllers) {
      controller.abort();
    }
    this.#requestControllers.clear();
  }

  get<T = any>(options: HttpRequest) {
    return this.#request<T>(options);
  }

  post<T = any>(options: HttpRequest) {
    return this.#request<T>({
      ...options,
      method: "POST",
    });
  }

  put<T = any>(options: HttpRequest) {
    return this.#request<T>({
      ...options,
      method: "PUT",
    });
  }

  delete<T = any>(options: HttpRequest) {
    return this.#request<T>({
      ...options,
      method: "DELETE",
    });
  }

  patch<T = any>(options: HttpRequest) {
    return this.#request<T>({
      ...options,
      method: "PATCH",
    });
  }

  // 创建 FormData 对象
  #createFormData(data: File | FormData | any): FormData {
    if (data instanceof File) {
      const form = new FormData();
      form.append("file", data);
      return form;
    }
    if (data instanceof FormData) {
      return data;
    }
    return new FormData();
  }

  // 从响应头中获取文件名
  #getFilenameFromResponse(response: BaseHttpResponse): string {
    const disposition = response.headers["content-disposition"];
    if (disposition?.includes("attachment")) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
        disposition
      );
      if (matches?.[1]) {
        return matches[1].replace(/['"]/g, "");
      }
    }
    return "download";
  }
}
