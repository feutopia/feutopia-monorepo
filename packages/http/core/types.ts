import {
	AxiosError,
	AxiosRequestConfig,
	AxiosResponse,
	CreateAxiosDefaults,
} from "axios";

export interface ResponseHandler<T = any> {
	handle(response: HttpResponse): Promise<T> | T;
}

export interface RequestHandler<T = any> {
	handle(request: HttpRequestConfig): Promise<T> | T;
}

export interface ErrorHandler {
	handle(error: HttpError): Promise<void> | void;
}

// 修改 ResponseType 的定义
export type ResponseType<T, R> = CancellablePromise<
	R extends ResponseHandler<T> ? T : HttpResponse<T>
>;

export interface HttpResponse<T = any> extends AxiosResponse {
	data: T;
}

// 定义 BaseHttp constructor 的配置
export interface BaseHttpOptions {
	config?: CreateAxiosDefaults & RequestOptions;
	requestHandler?: RequestHandler;
	responseHandler?: ResponseHandler;
	errorHandler?: ErrorHandler;
}

type RequestOptions = {
	showError?: boolean;
};

export type HttpRequestConfig = AxiosRequestConfig & RequestOptions;

export type HttpError = AxiosError & {
	config?: HttpRequestConfig;
};

export interface CancellablePromise<T> extends Promise<T> {
	cancel: () => void;
}

export interface UploadRequestConfig extends HttpRequestConfig {
	onProgress?: (percentage: number) => void;
	onUploadComplete?: (response: any) => void;
	onUploadError?: (error: Error) => void;
}

// 定义错误码
export enum ErrorCode {
	NETWORK_ERROR = "ERR_NETWORK", // 网络错误
	TIMEOUT = "ECONNABORTED", // 请求超时
	CANCELED = "ERR_CANCELED", // 请求取消
	SERVER_ERROR = "ERR_BAD_RESPONSE", // 服务器错误
	REQUEST_ERROR = "ERR_BAD_REQUEST", // 请求错误
}
