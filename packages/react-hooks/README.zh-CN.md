# React Hooks Collection

React Hooks 工具集

## 安装

```bash
pnpm add @feutopia/react-hooks
```

## Hooks

### useStableFn

创建一个稳定的函数引用，始终指向最新的函数实现，同时保持引用的一致性。

#### 用法

```tsx
import { useStableFn } from "@feutopia/react-hooks";
function MyComponent() {
  const [count, setCount] = useState(0);
  // 函数引用在重新渲染时保持稳定
  const handleClick = useStableFn(() => {
    setCount(count + 1);
  });
  return <button onClick={handleClick}>Click me</button>;
}
```

#### 特性

- 在重新渲染过程中保持稳定的函数引用
- 保留函数属性
- 支持正确的 `this` 上下文绑定
- 始终使用最新的函数实现

#### Parameters / 参数

- `fn`: 需要稳定化的函数

#### 返回值

- 一个稳定的函数引用，它将始终调用提供函数的最新版本

## 许可证

MIT
