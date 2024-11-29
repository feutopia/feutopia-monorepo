import axios, { AxiosInstance } from "axios";
import {
  HttpOptions,
  HttpRequest,
  UploadHttpRequest,
  BaseHttpResponse,
  HttpResponse,
} from "./types";

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
    if (!config.signal) {
      const controller = new AbortController();
      config.signal = controller.signal;
      this.#requestControllers.add(controller);
      const promise = this.#instance.request(config);
      promise.finally(() => {
        this.#requestControllers.delete(controller);
      });
      return Object.assign(promise, {
        cancel: () => controller.abort(),
      });
    }
    // 已有 signal 的情况
    return Object.assign(this.#instance.request(config), {
      cancel: () => {},
    });
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

  download<T extends Blob>(options: HttpRequest) {
    const promise = this.#request<T>({
      ...options,
      responseType: "blob",
    });
    promise.then((response) => {
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
    });
    return Object.assign(promise, {
      cancel: promise.cancel,
    });
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
