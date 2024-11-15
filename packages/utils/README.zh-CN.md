# @feutopia/utils

**中文** | [English](./README.md)
JavaScript/TypeScript 项目的通用工具函数库。

## 安装

```bash
npm install @feutopia/utils
```

## 功能特性

### 异步工具

#### delay

创建一个可取消的延迟/超时 Promise：

```typescript
import { delay, cancelDelay } from "@feutopia/utils";

// 创建一个 1000ms 的延迟
const delayPromise = delay(1000);

// 检查延迟是否仍在运行
const isRunning = delayPromise.isRunning();

// 需要时取消延迟
cancelDelay(delayPromise);

// 等待延迟完成
const { cancelled } = await delayPromise;
// 如果延迟被取消，cancelled 将为 true
```

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

### 对象工具

#### CreateWeakMap

创建一个带有额外 clear() 方法的 WeakMap 包装器：

```typescript
import { CreateWeakMap } from "@feutopia/utils";

// 创建一个新的 WeakMap
const weakMap = CreateWeakMap<object, string>();

// 设置值
const key = {};
weakMap.set(key, "value");

// 获取值
const value = weakMap.get(key);

// 清除所有条目
weakMap.clear();

// 检查键是否存在
const hasKey = weakMap.has(key);

// 删除一个条目
weakMap.delete(key);
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
