# @feutopia/http

**中文** | [English](./README.md)

一个基于 Axios 的强大 HTTP 请求库，提供增强功能和更便捷的 API。

## 特性

- 🚀 基于 Axios 构建，具有增强功能
- 🎯 内置 TypeScript 支持
- 🔄 请求/响应拦截器
- ⚡ 基于 Promise 的 API
- 📁 支持文件上传及进度跟踪
- ⬇️ 支持文件下载
- ❌ 请求取消功能
- 🎨 可自定义请求/响应处理器
- 🔍 全面的错误处理

## 安装

```bash
pnpm install @feutopia/http
```

## 基础用法

```ts
import { HttpClient } from "@feutopia/http";

class MyHttpClient extends HttpClient {
  constructor() {
    super({
      config: {
        baseURL: "https://api.example.com",
        timeout: 5000,
      },
    });
  }
}

const http = new MyHttpClient();

// GET 请求
const getData = async () => {
  const response = await http.get({ 
    url: "/users",
    showError: true // 可选：控制错误显示
  });
  return response.data;
};

// POST 请求（带类型安全）
const createUser = async (userData: UserData) => {
  const response = await http.post<UserResponse>({
    url: "/users",
    data: userData,
  });
  return response.data;
};
```

## 高级功能

### 自定义请求/响应拦截器

```ts
const http = new MyHttpClient();

// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    // 添加自定义请求头
    config.headers["X-Custom-Header"] = "value";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    // 转换响应数据
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### 文件上传

```ts
const uploadFile = async (file: File) => {
  await http.upload({
    url: "/upload",
    data: file, // 可以是 File、FormData 或其他数据
    onProgress: (percentage) => {
      console.log(`上传进度：${percentage}%`);
    },
    onUploadComplete: (response) => {
      console.log("上传完成：", response);
    },
    onUploadError: (error) => {
      console.error("上传失败：", error);
    },
  });
};
```

### 文件下载

```ts
const downloadFile = async () => {
	await http.download({
		url: "/files/document.pdf",
	});
};
```

### 请求取消

```ts
// 方式一：使用 cancel 方法
const request = http.get({ url: "/data" });
request.cancel();

// 方式二：取消所有待处理的请求
http.cancelAllRequests();
```

## 错误处理

该库提供全面的错误处理机制，包含预定义的错误代码：

```ts
import { ErrorCode } from "@feutopia/http";
try {
	await http.get({ url: "/data" });
} catch (error) {
	switch (error.code) {
		case ErrorCode.NETWORK_ERROR:
			console.error("发生网络错误");
			break;
		case ErrorCode.TIMEOUT:
			console.error("请求超时");
			break;
		case ErrorCode.CANCELED:
			console.error("请求已取消");
			break;
		// ... 处理其他错误类型
	}
}
```

## 许可证

MIT
