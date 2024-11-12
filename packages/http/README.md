# @feutopia/http

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
	const response = await http.get({ url: "/users" });
	return response.data;
};
// POST request
const createUser = async (userData) => {
	const response = await http.post({
		url: "/users",
		data: userData,
	});
	return response.data;
};
```

## Advanced Features

### Custom Request Handler

```ts
const http = new MyHttpClient({
	requestHandler: (config) => {
		// Add custom headers
		config.headers["X-Custom-Header"] = "value";
		return config;
	},
});
```

### Custom Response Handler

```ts
const http = new MyHttpClient({
	responseHandler: (response) => {
		// Transform response data
		return response.data;
	},
});
```

### File Upload

```ts
const uploadFile = async (file: File) => {
	await http.upload({
		url: "/upload",
		data: file,
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
const request = http.get({ url: "/data" });
// Cancel the request
request.cancel();
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
