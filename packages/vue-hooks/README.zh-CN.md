# Vue 3 组合式函数

**中文** | [English](./README.md)

Vue 3 组合式 API 钩子函数集合。

## 安装

```bash
pnpm add @feutopia/vue-hooks
```

## 钩子函数

### useInterval

用于设置和管理定时器的钩子函数。

```ts
const { pause, resume, isActive } = useInterval(
  () => {
    // 你的回调函数
  },
  1000, // 间隔时间（毫秒）
  { immediate: false } // 配置项
);
```

**参数：**

- `callback`: 每个间隔需要执行的回调函数
- `interval`: 间隔时间，单位为毫秒（默认：1000）
- `options`:
  - `immediate`: 是否立即执行回调函数（默认：false）

**返回值：**

- `pause`: 暂停定时器的函数
- `resume`: 恢复定时器的函数
- `isActive`: 表示定时器是否激活的响应式引用

### useRefExpose

一个用于更便捷地访问组件 ref 属性的钩子函数。

**参数：**

- `ref`: 包含组件实例的 Vue ref，可以是 undefined 或 null

**返回值：**

- 一个代理对象，允许直接访问 ref 值的属性

**特性：**

- 访问属性时自动解包 `.value`
- 安全处理 null/undefined 的 ref 值
- 支持使用 `in` 运算符检查属性

**常见用例：**

1. 直接访问组件 ref 的属性

```ts
const target = ref<ComponentInstance | null>(null);
const exposed = useRefExpose(target);
// 无需使用 .value 直接访问属性
console.log(exposed.someProperty);
console.log(exposed.someMethod());
```

2. 在封装组件中转发子组件的 ref

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'
import { useRefExpose } from '@feutopia/vue-hooks'

const childRef = ref<InstanceType<typeof ChildComponent>>()
// 转发子组件的所有方法和属性
defineExpose(useRefExpose(childRef))
</script>

<template>
  <ChildComponent ref="childRef" />
</template>
```

### useResizeObserver

用于观察元素大小变化的钩子函数，基于 ResizeObserver。

```ts
const target = ref<HTMLElement | null>(null);
const { isSupported, stop } = useResizeObserver(target, (entries) => {
  // 处理大小变化
});
```

**参数：**

- `target`: 要观察的 HTML 元素的引用
- `callback`: 当大小变化时调用的函数

**返回值：**

- `isSupported`: 表示浏览器是否支持 ResizeObserver 的计算属性
- `stop`: 停止观察的函数

### useRequest

一个用于管理异步请求的 Hook，支持轮询、手动控制和自动错误处理等特性。

```ts
const {
  data,
  loading,
  error,
  run,
  cancel,
  refresh,
  cancelled
  } = useRequest<TData, TParams>(
  (params: TParams) => Promise<TData>, // service 函数
  {
  // 配置项
  manual?: boolean | Ref<boolean>,
  pollingInterval?: number | Ref<number>,
  ready?: boolean | Ref<boolean>,
  refreshDeps?: WatchSource[],
  params?: TParams[],
  cacheKey?: string | symbol | Ref<string | symbol>,
  cacheTime?: number | Ref<number>,
  // 回调函数
  onBefore?: () => void,
  onSuccess?: (data: TData, params: TParams[]) => void,
  onError?: (error: Error) => void,
  onFinally?: () => void,
  }
);
```

**参数：**

- `service`: `(params: TParams) => Promise<TData>`
  - 执行异步请求的函数
  - 泛型类型：
    - `TData`: service 返回的数据类型
    - `TParams`: service 接收的参数类型

- `options`:
  - `manual`: 是否手动触发请求（默认：`false`）
  - `pollingInterval`: 轮询间隔时间（毫秒）（默认：`0`，表示不轮询）
  - `ready`: 控制请求是否应该执行（默认：`true`）
  - `refreshDeps`: 依赖数组，当依赖变化时触发请求刷新
  - `params`: service 函数的初始参数
  - `cacheKey`: 缓存请求结果的唯一键
  - `cacheTime`: 缓存持续时间（毫秒）（默认：`0`，表示不缓存）
  - `onBefore`: 请求开始前的回调
  - `onSuccess`: 请求成功时的回调，参数为响应数据和请求参数
  - `onError`: 请求失败时的回调，参数为错误对象
  - `onFinally`: 请求完成时的回调

**返回值：**

- `data`: `Ref<TData | undefined>` - 响应数据
- `loading`: `Ref<boolean>` - 加载状态
- `error`: `Ref<Error | undefined>` - 请求失败时的错误对象
- `run`: `(...params: TParams[]) => Promise<FetchState<TData>>` - 手动触发请求的函数
- `cancel`: `() => void` - 取消当前请求的函数
- `refresh`: `() => Promise<FetchState<TData>>` - 使用上次的参数刷新请求的函数
- `cancelled`: `Ref<boolean>` - 请求是否被取消

**示例：**

```ts
interface User {
  id: number;
  name: string;
}
const { data, loading, run } = useRequest<User, [number]>(
  (id) => fetchUser(id),
  {
    manual: true,
    onSuccess: (data) => {
      console.log("用户加载成功:", data.name);
    },
  }
);
// 手动触发请求并传入参数
run(1);
```

## 许可证

MIT
