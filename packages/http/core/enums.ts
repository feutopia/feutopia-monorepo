// 定义错误码
export enum ErrorCode {
	NETWORK_ERROR = "ERR_NETWORK", // 网络错误
	TIMEOUT = "ECONNABORTED", // 请求超时
	CANCELED = "ERR_CANCELED", // 请求取消
	SERVER_ERROR = "ERR_BAD_RESPONSE", // 服务器错误
	REQUEST_ERROR = "ERR_BAD_REQUEST", // 请求错误
}
