# 事件发射器

[English](https://github.com/feutopia/feutopia-monorepo/blob/main/packages/mitt/README.md) | **中文**

事件发射器。基于 [mitt](https://github.com/developit/mitt)。

## 安装

```bash
npm install @feutopia/mitt
```

## 特性

- 体积小巧
- TypeScript 支持
- 支持通配符事件处理
- 通过 `on()` 返回函数实现自动清理
- 支持 `once()` 单次事件绑定

## 使用方法

```typescript
import mitt from '@feutopia/mitt';

// 定义事件类型
type Events = {
  foo: string;
  bar: number;
  baz: undefined;
};

// 创建类型化的发射器
const emitter = mitt<Events>();

// 常规事件处理
emitter.on('foo', (value) => {
  console.log('foo 事件:', value); // value 类型为 string
});

// 单次事件处理
emitter.once('bar', (value) => {
  console.log('bar 事件:', value); // value 类型为 number
});

// 通配符处理器
emitter.on('*', (type, value) => {
  console.log('任意事件:', type, value);
});

// 使用返回函数进行自动清理
const off = emitter.on('foo', handler);
// 之后...
off(); // 移除处理器

// 触发事件
emitter.emit('foo', 'hello');
emitter.emit('bar', 123);
emitter.emit('baz'); // undefined 类型事件不需要载荷

// 移除特定处理器
emitter.off('foo', handler);

// 移除某个事件的所有处理器
emitter.off('foo');

// 清除所有处理器
emitter.clear();
```

## API

### `mitt<Events>()`

创建新的事件发射器实例。

### `on<Key>(type: Key, handler: Handler)`

注册指定类型的事件处理器。返回一个函数，调用该函数时移除处理器。

### `once<Key>(type: Key, handler: Handler)`

注册一个一次性事件处理器，触发一次后自动移除。

### `off<Key>(type: Key, handler?: Handler)`

移除指定类型的事件处理器。如果未提供 handler 参数，则移除该类型的所有处理器。

### `emit<Key>(type: Key, event?: Events[Key])`

触发指定类型的事件，可携带可选的载荷数据。

### `clear()`

移除所有事件处理器。

## 许可证

MIT
