# Vue 3 Composables

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

### useRequest

A hook for managing asynchronous requests with features like polling, manual control, and automatic error handling.

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

**Parameters:**

- `service`: Async function that performs the request
- `options`:
  - `manual`: Whether to manually trigger the request (default: false)
  - `pollingInterval`: Interval for polling in milliseconds (default: 0, no polling)
  - `ready`: Control whether the request should execute (default: true)
  - `refreshDeps`: Dependencies array that triggers request refresh when changed
  - `params`: Initial parameters for the service function
  - `onBefore`: Callback before request starts
  - `onSuccess`: Callback when request succeeds
  - `onError`: Callback when request fails
  - `onFinally`: Callback when request completes

**Returns:**

- `data`: Response data
- `loading`: Loading state
- `error`: Error object if request fails
- `run`: Function to manually trigger the request
- `cancel`: Function to cancel the current request
- `refresh`: Function to refresh using the last used parameters
- `cancelled`: Whether the request was cancelled

## License

MIT
