import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  HttpOptions,
  HttpRequest,
  UploadHttpRequest,
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

  #request<T>(config: HttpRequest): HttpResponse<T> {
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

    // 这里真正返回的类型是 HttpResponse<AxiosResponse<T>>,
    // 之所以使用 as 关键字, 是已经假定用户自定义的拦截器会取 response.data 的值。
    return Object.assign(promise, {
      cancel,
    }) as HttpResponse<T>;
  }

  upload<T>(options: UploadHttpRequest) {
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
    const promise = this.#request<AxiosResponse<T>>({
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

  get<T>(options: HttpRequest) {
    return this.#request<T>(options);
  }

  post<T>(options: HttpRequest) {
    return this.#request<T>({
      ...options,
      method: "POST",
    });
  }

  put<T>(options: HttpRequest) {
    return this.#request<T>({
      ...options,
      method: "PUT",
    });
  }

  delete<T>(options: HttpRequest) {
    return this.#request<T>({
      ...options,
      method: "DELETE",
    });
  }

  patch<T>(options: HttpRequest) {
    return this.#request<T>({
      ...options,
      method: "PATCH",
    });
  }

  // 创建 FormData 对象
  #createFormData(data: File | FormData): FormData {
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
  #getFilenameFromResponse(response: AxiosResponse): string {
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
