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

## 许可证

MIT
