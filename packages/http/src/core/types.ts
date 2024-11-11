import {
	AxiosError,
	AxiosRequestConfig,
	AxiosResponse,
	CreateAxiosDefaults,
} from "axios";

// 1. 基础配置类型
type RequestOptions = {
	showError?: boolean;
};

export type HttpRequestConfig = AxiosRequestConfig & RequestOptions;

// 2. 基础响应和错误类型
export interface HttpResponse<T = any> extends AxiosResponse {
	data: T;
}

export type HttpError = AxiosError & {
	config?: HttpRequestConfig;
};

// 3. 处理器类型
export type RequestHandler<T = any> = (
	request: HttpRequestConfig
) => Promise<T> | T;

export type ResponseHandler<T = any> = (
	response: HttpResponse
) => Promise<T> | T;

export type ErrorHandler = (error: HttpError) => Promise<void> | void;

// 4. 通用工具类型
export interface CancellablePromise<T> extends Promise<T> {
	cancel: () => void;
}

export type ResponseType<T, R> = CancellablePromise<
	R extends ResponseHandler<T> ? T : HttpResponse<T>
>;

// 5. 配置相关类型
export interface HttpClientOptions {
	config?: CreateAxiosDefaults & RequestOptions;
	requestHandler?: RequestHandler;
	responseHandler?: ResponseHandler;
	errorHandler?: ErrorHandler;
}

// 6. 特殊用途类型
export interface UploadRequestConfig extends HttpRequestConfig {
	onProgress?: (percentage: number) => void;
	onUploadComplete?: (response: any) => void;
	onUploadError?: (error: Error) => void;
}
