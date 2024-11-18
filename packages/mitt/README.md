# Event emitter

**English** | [中文](https://github.com/feutopia/feutopia-monorepo/blob/main/packages/mitt/README.zh-CN.md)

Based on [mitt](https://github.com/developit/mitt).

## Installation

```bash
npm install @feutopia/mitt
```

## Features

- Tiny footprint
- TypeScript support
- Supports wildcard event handlers
- Event handler auto-cleanup with `on()` return function
- Single event binding with `once()`

## Usage

```typescript
import mitt from '@feutopia/mitt';

// Define your event types
type Events = {
  foo: string;
  bar: number;
  baz: undefined;
};

// Create a typed emitter
const emitter = mitt<Events>();

// Regular event handling
emitter.on('foo', (value) => {
  console.log('foo event:', value); // value is typed as string
});

// One-time event handling
emitter.once('bar', (value) => {
  console.log('bar event:', value); // value is typed as number
});

// Wildcard handler
emitter.on('*', (type, value) => {
  console.log('any event:', type, value);
});

// Auto-cleanup using return function
const off = emitter.on('foo', handler);
// Later...
off(); // Removes the handler

// Emit events
emitter.emit('foo', 'hello');
emitter.emit('bar', 123);
emitter.emit('baz'); // No payload needed for undefined events

// Remove specific handler
emitter.off('foo', handler);

// Remove all handlers for an event
emitter.off('foo');

// Clear all handlers
emitter.clear();
```

## API

### `mitt<Events>()`

Creates a new event emitter instance.

### `on<Key>(type: Key, handler: Handler)`

Registers an event handler for the given type. Returns a function that removes the handler when called.

### `once<Key>(type: Key, handler: Handler)`

Registers a one-time event handler that automatically removes itself after being called once.

### `off<Key>(type: Key, handler?: Handler)`

Removes an event handler for the given type. If handler is omitted, removes all handlers for that type.

### `emit<Key>(type: Key, event?: Events[Key])`

Emits an event with the given type and optional payload.

### `clear()`

Removes all event handlers.

## License

MIT
