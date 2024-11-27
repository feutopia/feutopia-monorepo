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

### 数组工具

#### circularSlice

创建一个带有循环包装的数组切片，从指定位置开始：

```typescript
import { circularSlice } from "@feutopia/utils";

const arr = [1, 2, 3, 4, 5];

// 基本切片
circularSlice(arr, 0, 3); // [1, 2, 3]
circularSlice(arr, 3, 3); // [4, 5, 1]
circularSlice(arr, 4, 3); // [5, 1, 2]

// 处理负数起始索引
circularSlice(arr, -1, 3); // [5, 1, 2]

// 处理长度大于数组长度的情况
const arr2 = [1, 2, 3];
circularSlice(arr2, 0, 5); // [1, 2, 3, 1, 2]
```

### 类型工具

提供 TypeScript 工具类型以增强类型安全：

```typescript
import { IsNullable, RequireNonNull, NonNullableProps, DropParams } from "@feutopia/utils";

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

// 移除函数参数
function example(a: string, b: number, c: boolean) {
  return true;
}
type WithoutFirstParam = DropParams<typeof example>; // [b: number, c: boolean]
type WithoutTwoParams = DropParams<typeof example, 2>; // [c: boolean]
```

### 日期工具

提供一组日期格式化和信息提取的实用工具：

```ts
import { getDateInfo, formatTime, formatDate } from "@feutopia/utils";

// 获取当前日期的详细信息（支持中英双语）
const dateInfo = getDateInfo();
console.log(dateInfo);
/*
{
  year: 2024,            // 年份
  month: 3,              // 月份 (1-12)
  day: 15,               // 日期
  dayStr: "15",          // 补零后的日期
  hour: 14,              // 小时（24小时制）
  hourStr: "14",         // 补零后的小时
  minute: 30,            // 分钟
  minuteStr: "30",       // 补零后的分钟
  second: 45,            // 秒
  secondStr: "45",       // 补零后的秒
  weekdayEn: "Friday",   // 英文星期
  weekdayCn: "星期五",    // 中文星期
  monthEn: "March",      // 英文月份
  monthCn: "三月",        // 中文月份
  timestamp: 1710506245000,  // Unix 时间戳
  dateStr: "2024-03-15T14:30:45.000Z"  // ISO 日期字符串
}
*/

// 格式化时间，支持自定义分隔符
formatTime(dateInfo);           // "14:30:45"
formatTime(dateInfo, "-");      // "14-30-45"

// 格式化日期，支持自定义分隔符
formatDate(dateInfo);           // "2024-03-15"
formatDate(dateInfo, "/");      // "2024/03/15"

// 数字补零工具
padZero(5);  // "05"
padZero(10); // "10"
```

### 类型检查

提供全面的类型检查工具函数：

```typescript
import { 
  isArray,
  isDate,
  isError,
  isFunction,
  isMap,
  isNumber,
  isObject,
  isPlainObject,
  isPromise,
  isRegExp,
  isSet,
  isValidNumber,
  // ... 更多函数
} from "@feutopia/utils";

// 检查数组
isArray([1, 2, 3]); // true
isArray({}); // false

// 检查数字
isNumber(123); // true
isValidNumber(NaN); // false
isValidNumber(Infinity); // false

// 检查对象
isObject({}); // true
isPlainObject(new Date()); // false
isPlainObject({}); // true

// 检查内置类型
isDate(new Date()); // true
isPromise(Promise.resolve()); // true
isMap(new Map()); // true
isSet(new Set()); // true
```

## 许可证

MIT
