# @feutopia/utils

**English** | [中文](https://github.com/feutopia/feutopia-monorepo/blob/main/packages/utils/README.zh-CN.md)

Common utility functions for JavaScript/TypeScript projects.

## Installation

```bash
npm install @feutopia/utils
```

## Features

### Async Utilities

#### delay

Creates a cancelable delay/timeout promise:

```typescript
import { delay, cancelDelay } from "@feutopia/utils";

// Create a delay of 1000ms
const delayPromise = delay(1000);

// Check if delay is still running
const isRunning = delayPromise.isRunning();

// Cancel the delay if needed
cancelDelay(delayPromise);

// Wait for delay
const { cancelled } = await delayPromise;
// cancelled will be true if the delay was canceled
```

#### buildCancelableTask

Creates a cancelable task wrapper for async operations:

```typescript
import { buildCancelableTask } from "@feutopia/utils";

// Create a cancelable task
const task = buildCancelableTask(async () => {
	// Your async operation
	const result = await fetch("https://api.example.com/data");
	return result.json();
});

// Run the task
const { data, error, cancelled } = await task.run();

// Cancel the task if needed
task.cancel();

// Check if task was canceled
const isCanceled = task.isCanceled();
```

### Object Utilities

#### CreateWeakMap

Creates a WeakMap wrapper with additional clear() method:

```typescript
import { CreateWeakMap } from "@feutopia/utils";

// Create a new WeakMap
const weakMap = CreateWeakMap<object, string>();

// Set a value
const key = {};
weakMap.set(key, "value");

// Get a value
const value = weakMap.get(key);

// Clear all entries
weakMap.clear();

// Check if key exists
const hasKey = weakMap.has(key);

// Delete an entry
weakMap.delete(key);
```

### Type Utilities

Provides TypeScript utility types for better type safety:

```typescript
import { IsNullable, RequireNonNull, NonNullableProps } from "@feutopia/utils";

// Check if type might be null/undefined
type MightBeNull = IsNullable<string | null>; // true
type CantBeNull = IsNullable<string>; // false

// Filter out nullable properties from an interface
interface User {
	id: number;
	name: string;
	avatar?: string;
}
type RequiredUserProps = NonNullableProps<User>; // { id: number; name: string }
```

## License

MIT
