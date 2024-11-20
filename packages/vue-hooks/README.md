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

### useRefExpose

A hook that creates a proxy for accessing component ref properties more conveniently.

**Parameters:**

- `ref`: A Vue ref containing a component instance, which can be undefined or null

**Returns:**

- A proxy object that allows direct access to the ref's value properties

**Features:**

- Automatically unwraps the `.value` when accessing properties
- Safely handles null/undefined ref values
- Supports the `in` operator for property checks

**Common Use Cases:**

1. Direct access to component ref properties

```ts
const target = ref<ComponentInstance | null>(null);
const exposed = useRefExpose(target);
// Access properties directly without .value
console.log(exposed.someProperty);
console.log(exposed.someMethod());
```

2. Forwarding child component refs in wrapper components

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'
import { useRefExpose } from '@feutopia/vue-hooks'

const childRef = ref<InstanceType<typeof ChildComponent>>()
// Forward all methods and properties from child component
defineExpose(useRefExpose(childRef))
</script>

<template>
  <ChildComponent ref="childRef" />
</template>
```

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
  refresh,
  cancelled
  } = useRequest(
  (params: TParams) => Promise<TData>, // service function
  {
  // Options
  manual?: boolean | Ref<boolean>,
  pollingInterval?: number | Ref<number>,
  ready?: boolean | Ref<boolean>,
  refreshDeps?: WatchSource[],
  params?: TParams[],
  cacheKey?: string | symbol | Ref<string | symbol>,
  cacheTime?: number | Ref<number>,
  // Callbacks
  onBefore?: () => void,
  onSuccess?: (data: TData, params: TParams[]) => void,
  onError?: (error: Error) => void,
  onFinally?: () => void,
  }
);
```

**Parameters:**

- `service`: `(params: TParams) => Promise<TData>`
  - Async function that performs the request
  - Generic types:
    - `TData`: Type of the data returned by the service
    - `TParams`: Type of the parameters accepted by the service

- `options`:
  - `manual`: Whether to manually trigger the request (default: `false`)
  - `pollingInterval`: Interval for polling in milliseconds (default: `0`, no polling)
  - `ready`: Control whether the request should execute (default: `true`)
  - `refreshDeps`: Dependencies array that triggers request refresh when changed
  - `params`: Initial parameters for the service function
  - `cacheKey`: Unique key for caching request results
  - `cacheTime`: Duration in milliseconds to cache the result (default: `0`, no caching)
  - `onBefore`: Callback before request starts
  - `onSuccess`: Callback when request succeeds with data and params
  - `onError`: Callback when request fails with error
  - `onFinally`: Callback when request completes

**Returns:**

- `data`: `Ref<TData | undefined>` - Response data
- `loading`: `Ref<boolean>` - Loading state
- `error`: `Ref<Error | undefined>` - Error object if request fails
- `run`: `(...params: TParams[]) => Promise<FetchState<TData>>` - Function to manually trigger the request
- `cancel`: `() => void` - Function to cancel the current request
- `refresh`: `() => Promise<FetchState<TData>>` - Function to refresh using the last used parameters
- `cancelled`: `Ref<boolean>` - Whether the request was cancelled

**Example:**

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
      console.log("User loaded:", data.name);
    },
  }
);
// Manual trigger with parameters
run(1);
```

### useDate

A hook for managing and formatting date/time with automatic updates.

```ts
const { dateInfo, formatTime, formatDate } = useDate();
```

**Returns:**

- `dateInfo`: Reactive reference to the current date information that updates every second
- `formatTime`: Function to format the current time (HH:MM:SS)
- `formatDate`: Function to format the current date (YYYY-MM-DD)

**Example:**

```ts
const { dateInfo, formatTime, formatDate } = useDate();

// Get formatted time with default separator ":"
console.log(formatTime()); // "14:30:45"

// Get formatted time with custom separator
console.log(formatTime("-")); // "14-30-45"

// Get formatted date with default separator "-"
console.log(formatDate()); // "2024-03-20"

// Get formatted date with custom separator
console.log(formatDate("/")); // "2024/03/20"

// Access raw date information
console.log(dateInfo.value.year);  // 2024
console.log(dateInfo.value.month); // 3
console.log(dateInfo.value.day);   // 20
```

## License

MIT
