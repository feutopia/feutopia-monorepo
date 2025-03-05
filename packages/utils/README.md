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
const isRunning = delayPromise.isRunning;

// Cancel the delay if needed
cancelDelay(delayPromise);

// Wait for delay
const cancelled = await delayPromise;
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
task.cancelled;
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

### Array Utilities

#### circularSlice

Creates a slice of array with circular wrapping, starting from specified position:

```typescript
import { circularSlice } from "@feutopia/utils";

const arr = [1, 2, 3, 4, 5];

// Basic slicing
circularSlice(arr, 0, 3); // [1, 2, 3]
circularSlice(arr, 3, 3); // [4, 5, 1]
circularSlice(arr, 4, 3); // [5, 1, 2]

// Handle negative start index
circularSlice(arr, -1, 3); // [5, 1, 2]

// Handle count greater than array length
const arr2 = [1, 2, 3];
circularSlice(arr2, 0, 5); // [1, 2, 3, 1, 2]
```

### Type Utilities

Provides TypeScript utility types for better type safety:

```typescript
import { IsNullable, RequireNonNull, NonNullableProps, DropParams } from "@feutopia/utils";

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

// Remove parameters from function type
function example(a: string, b: number, c: boolean) {
  return true;
}
type WithoutFirstParam = DropParams<typeof example>; // [b: number, c: boolean]
type WithoutTwoParams = DropParams<typeof example, 2>; // [c: boolean]
```

### Date Utilities

A collection of utilities for date formatting and information extraction:

```ts
import { getDateInfo, formatTime, formatDate } from "@feutopia/utils";

// Get current date information with bilingual support
const dateInfo = getDateInfo();
console.log(dateInfo);
/*
{
  year: 2024,            // Current year
  month: 3,              // Current month (1-12)
  day: 15,               // Current day
  dayStr: "15",          // Zero-padded day
  hour: 14,              // Hour (24-hour format)
  hourStr: "14",         // Zero-padded hour
  minute: 30,            // Minute
  minuteStr: "30",       // Zero-padded minute
  second: 45,            // Second
  secondStr: "45",       // Zero-padded second
  weekdayEn: "Friday",   // English weekday
  weekdayCn: "星期五",    // Chinese weekday
  monthEn: "March",      // English month
  monthCn: "三月",        // Chinese month
  timestamp: 1710506245000,  // Unix timestamp
  dateStr: "2024-03-15T14:30:45.000Z"  // ISO date string
}
*/

// Format time with custom separator
formatTime(dateInfo);           // "14:30:45"
formatTime(dateInfo, "-");      // "14-30-45"

// Format date with custom separator
formatDate(dateInfo);           // "2024-03-15"
formatDate(dateInfo, "/");      // "2024/03/15"

// Pad single digit numbers with zero
padZero(5);  // "05"
padZero(10); // "10"
```

### Type Checking

Provides a comprehensive set of type checking utilities:

```typescript
import { 
  isArray,
  isDate,
  isError,
  isFunction,
  isMap,
  isNumber,
  isObject,
  isPlainObject,
  isPromise,
  isRegExp,
  isSet,
  isValidNumber,
  // ... and more
} from "@feutopia/utils";

// Check arrays
isArray([1, 2, 3]); // true
isArray({}); // false

// Check numbers
isNumber(123); // true
isValidNumber(NaN); // false
isValidNumber(Infinity); // false

// Check objects
isObject({}); // true
isPlainObject(new Date()); // false
isPlainObject({}); // true

// Check built-in types
isDate(new Date()); // true
isPromise(Promise.resolve()); // true
isMap(new Map()); // true
isSet(new Set()); // true
```

## License

MIT
