# @feutopia/utils

**English** | [中文](https://github.com/feutopia/feutopia-monorepo/blob/main/packages/utils/README.zh-CN.md)

Common utility functions for JavaScript/TypeScript projects.

## Installation

```bash
npm install @feutopia/utils
```

## Features

### Async Utilities

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
