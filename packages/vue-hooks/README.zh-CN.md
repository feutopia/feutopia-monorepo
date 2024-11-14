# @feutopia/vue-hooks

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
  refresh
} = useRequest(service, {
  manual: false,
  pollingInterval: 0,
  ready: true,
  refreshDeps: [],
  onBefore: () => {},
  onSuccess: (data, params) => {},
  onError: (error, params) => {},
  onFinally: (params) => {},
});
```

**参数：**

- `service`: 执行异步请求的函数
- `options`:
  - `manual`: 是否手动触发请求（默认：false）
  - `pollingInterval`: 轮询间隔时间（毫秒）（默认：0，表示不轮询）
  - `ready`: 控制请求是否应该执行（默认：true）
  - `refreshDeps`: 依赖数组，当依赖变化时触发请求刷新
  - `params`: service 函数的初始参数
  - `onBefore`: 请求开始前的回调
  - `onSuccess`: 请求成功时的回调
  - `onError`: 请求失败时的回调
  - `onFinally`: 请求完成时的回调

**返回值：**

- `data`: 响应数据
- `loading`: 加载状态
- `error`: 请求失败时的错误对象
- `run`: 手动触发请求的函数
- `cancel`: 取消当前请求的函数
- `refresh`: 使用上次的参数刷新请求
- `cancelled`: 请求是否被取消

## 许可证

MIT
