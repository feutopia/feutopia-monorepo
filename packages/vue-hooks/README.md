# @feutopia/vue-hooks

**English** | [中文](https://github.com/feutopia/feutopia-monorepo/blob/main/packages/vue-hooks/README.zh-CN.md)

A collection of composable Vue 3 hooks.

## Installation

```bash
pnpm add @feutopia/vue-hooks
```

## Hooks

### useInterval

A hook for setting up and managing intervals.

```ts
const { pause, resume, isActive } = useInterval(
  () => {
    // your callback function
  },
  1000, // interval in milliseconds
  { immediate: false } // options
);
```

**Parameters:**

- `callback`: Function to be called at each interval
- `interval`: Interval duration in milliseconds (default: 1000)
- `options`:
  - `immediate`: Whether to call the callback immediately (default: false)

**Returns:**

- `pause`: Function to pause the interval
- `resume`: Function to resume the interval
- `isActive`: Ref indicating if the interval is active

### useResizeObserver

A hook for observing element size changes using ResizeObserver.

```ts
const target = ref<HTMLElement | null>(null);
const { isSupported, stop } = useResizeObserver(target, (entries) => {
  // handle resize
});
```

**Parameters:**

- `target`: Reference to the HTML element to observe
- `callback`: Function called when resize occurs

**Returns:**

- `isSupported`: Computed ref indicating if ResizeObserver is supported
- `stop`: Function to stop observing

## License

MIT
