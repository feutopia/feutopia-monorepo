# @feutopia/http

**English** | [中文](https://github.com/feutopia/feutopia-monorepo/blob/main/packages/http/README.zh-CN.md)

A powerful HTTP request library based on Axios, providing enhanced features and a more convenient API.

## Features

- 🚀 Built on top of Axios with enhanced functionality
- 🎯 TypeScript support out of the box
- 🔄 Request/Response interceptors
- ⚡ Promise-based API
- 📁 File upload with progress tracking
- ⬇️ File download support
- ❌ Request cancellation
- 🎨 Customizable request/response handlers
- 🔍 Comprehensive error handling

## Installation

```bash
pnpm install @feutopia/http
```

## Basic Usage

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

// GET request
const getData = async () => {
  const response = await http.get({ 
    url: "/users",
    showError: true // Optional: control error display
  });
  return response.data;
};

// POST request with type safety
const createUser = async (userData: UserData) => {
  const response = await http.post<UserResponse>({
    url: "/users",
    data: userData,
  });
  return response.data;
};
```

## Advanced Features

### Custom Request/Response Interceptors

```ts
const http = new MyHttpClient();

// Add request interceptor
http.interceptors.request.use(
  (config) => {
    // Add custom headers
    config.headers["X-Custom-Header"] = "value";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
http.interceptors.response.use(
  (response) => {
    // Transform response data
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### File Upload

```ts
const uploadFile = async (file: File) => {
  await http.upload({
    url: "/upload",
    data: file, // Can be File, FormData, or other data
    onProgress: (percentage) => {
      console.log(`Upload progress: ${percentage}%`);
    },
    onUploadComplete: (response) => {
      console.log("Upload complete:", response);
    },
    onUploadError: (error) => {
      console.error("Upload failed:", error);
    },
  });
};
```

### File Download

```ts
const downloadFile = async () => {
	await http.download({
		url: "/files/document.pdf",
	});
};
```

### Request Cancellation

```ts
// Method 1: Using the cancel method
const request = http.get({ url: "/data" });
request.cancel();

// Method 2: Cancel all pending requests
http.cancelAllRequests();
```

## Error Handling

The library provides comprehensive error handling with predefined error codes:

```ts
import { ErrorCode } from "@feutopia/http";
try {
	await http.get({ url: "/data" });
} catch (error) {
	switch (error.code) {
		case ErrorCode.NETWORK_ERROR:
			console.error("Network error occurred");
			break;
		case ErrorCode.TIMEOUT:
			console.error("Request timed out");
			break;
		case ErrorCode.CANCELED:
			console.error("Request was canceled");
			break;
		// ... handle other error types
	}
}
```

## License

MIT
