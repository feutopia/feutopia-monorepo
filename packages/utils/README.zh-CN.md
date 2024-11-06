# @feutopia/utils

**中文** | [English](./README.md)
JavaScript/TypeScript 项目的通用工具函数库。

## 安装

```bash
npm install @feutopia/utils
```

## 功能特性

### 异步工具

#### buildCancelableTask

创建可取消的异步任务包装器：

```typescript
import { buildCancelableTask } from "@feutopia/utils";

// 创建可取消的任务
const task = buildCancelableTask(async () => {
	// 你的异步操作
	const result = await fetch("https://api.example.com/data");
	return result.json();
});

// 运行任务
const { data, error, cancelled } = await task.run();

// 需要时取消任务
task.cancel();

// 检查任务是否已被取消
const isCanceled = task.isCanceled();
```

### 类型工具

提供 TypeScript 工具类型以增强类型安全：

```typescript
import { IsNullable, RequireNonNull, NonNullableProps } from "@feutopia/utils";

// 检查类型是否可能为 null/undefined
type MightBeNull = IsNullable<string | null>; // true
type CantBeNull = IsNullable<string>; // false

// 从接口中过滤掉可为空的属性
interface User {
	id: number;
	name: string;
	avatar?: string;
}
type RequiredUserProps = NonNullableProps<User>; // { id: number; name: string }
```

## 许可证

MIT
