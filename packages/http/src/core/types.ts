import type { AxiosRequestConfig, CreateAxiosDefaults } from "axios";

// 基础配置
type RequestOptions = {
  showError?: boolean;
};

// http 客户端构造函数入参
export interface HttpOptions {
  config?: CreateAxiosDefaults & RequestOptions;
}

// http 请求类型
export type HttpRequest = AxiosRequestConfig & RequestOptions;

// http 上传请求类型
export interface UploadHttpRequest extends HttpRequest {
  onProgress?: (percentage: number) => void;
}

/*
  可取消的 HTTP 响应类型
  注意: 这里没有 `extends Promise<AxiosResponse<T>>`, 而是 `extends Promise<T>`,
        因为已经假定用户自定义的拦截器会取 response.data 的值。
*/
export interface HttpResponse<T> extends Promise<T> {
  cancel: () => void;
}
