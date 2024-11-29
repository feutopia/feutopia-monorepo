import type {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";

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

// 基础 HTTP 响应类型
export interface BaseHttpResponse<T = any> extends AxiosResponse {
  data: T;
}

// 可取消的 HTTP 响应类型
export interface HttpResponse<T = any> extends Promise<BaseHttpResponse<T>> {
  cancel: () => void;
}
