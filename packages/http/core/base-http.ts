import axios, { AxiosInstance } from "axios";
import {
	ResponseType,
	HttpError,
	HttpResponse,
	HttpRequestConfig,
	UploadRequestConfig,
	BaseHttpOptions,
	ResponseHandler,
	RequestHandler,
	ErrorHandler,
} from "./types";

export abstract class BaseHttp {
	protected instance: AxiosInstance;
	protected responseHandler?: ResponseHandler;
	protected requestHandler?: RequestHandler;
	protected errorHandler?: ErrorHandler;
	private requestControllers: Map<Symbol, AbortController> = new Map();

	constructor(options: BaseHttpOptions = {}) {
		this.instance = axios.create(options.config || {});
		this.requestHandler = options.requestHandler;
		this.responseHandler = options.responseHandler;
		this.errorHandler = options.errorHandler;
		this.setupInterceptors();
	}

	private setupInterceptors(): void {
		this.instance.interceptors.request.use(
			async (config) => {
				const isGet = config.method?.toUpperCase() === "GET";
				const newConfig: HttpRequestConfig = {
					...config,
				};
				if (!isGet && newConfig.params) {
					newConfig.data = newConfig.params;
					delete newConfig.params;
				}
				if (this.requestHandler) {
					return await this.requestHandler(newConfig);
				}
				return newConfig;
			},
			(error: HttpError) => Promise.reject(error)
		);

		this.instance.interceptors.response.use(
			async (response) => {
				// 处理 blob 类型的响应
				if (response.config.responseType === "blob") {
					return response;
				}
				// 使用注入的响应处理器处理业务响应
				if (this.responseHandler) {
					return await this.responseHandler(response);
				}
				return response;
			},
			async (error: HttpError) => {
				if (this.errorHandler) {
					await this.errorHandler(error);
				}
				return Promise.reject(error);
			}
		);
	}

	request<T = any, R = unknown>(config: HttpRequestConfig): ResponseType<T, R> {
		if (!config.signal) {
			const controller = new AbortController();
			config.signal = controller.signal;
			const requestKey = Symbol();
			this.requestControllers.set(requestKey, controller);
			const promise = this.instance.request(config).finally(() => {
				this.requestControllers.delete(requestKey);
			});
			return Object.assign(promise, {
				cancel: () => controller.abort(),
			}) as ResponseType<T, R>;
		}
		// 已有 signal 的情况
		return Object.assign(this.instance.request(config), {
			cancel: () => {},
		}) as ResponseType<T, R>;
	}

	cancelAllRequests(): void {
		for (const controller of this.requestControllers.values()) {
			controller.abort();
		}
		this.requestControllers.clear();
	}

	get<T = any>(options: HttpRequestConfig) {
		return this.request<T, ResponseHandler<T>>(options);
	}

	post<T = any>(options: HttpRequestConfig) {
		return this.request<T, ResponseHandler<T>>({
			...options,
			method: "POST",
		});
	}

	put<T = any>(options: HttpRequestConfig) {
		return this.request<T, ResponseHandler<T>>({
			...options,
			method: "PUT",
		});
	}

	delete<T = any>(options: HttpRequestConfig) {
		return this.request<T, ResponseHandler<T>>({
			...options,
			method: "DELETE",
		});
	}

	patch<T = any>(options: HttpRequestConfig) {
		return this.request<T, ResponseHandler<T>>({
			...options,
			method: "PATCH",
		});
	}

	// Add this new private helper method
	private createFormData(data: File | FormData | any): FormData {
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

	upload<T = any>(options: UploadRequestConfig) {
		const {
			onProgress,
			onUploadComplete,
			onUploadError,
			data,
			...otherOptions
		} = options;
		const formData = this.createFormData(data);
		const uploadPromise = this.request<T, ResponseHandler<T>>({
			...otherOptions,
			method: "POST",
			headers: { "Content-Type": "multipart/form-data" },
			data: formData,
			onUploadProgress: (progressEvent) => {
				if (onProgress && progressEvent.total) {
					onProgress(
						Math.round((progressEvent.loaded * 100) / progressEvent.total)
					);
				}
			},
		});
		return uploadPromise.then(onUploadComplete).catch(onUploadError);
	}

	download(options: HttpRequestConfig) {
		const promise = this.request<Blob>({
			...options,
			responseType: "blob",
		});
		const downloadPromise = promise.then((response) => {
			const blob = new Blob([response.data], {
				type: response.headers["content-type"],
			});
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = this.getFilenameFromResponse(response) || "download";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		});
		return Object.assign(downloadPromise, {
			cancel: () => promise.cancel(),
		});
	}
	private getFilenameFromResponse(response: HttpResponse): string {
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
