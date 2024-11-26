# React Hooks Collection

A collection of useful React hooks.

## Installation

```bash
pnpm add @feutopia/react-hooks
```

## Hooks

### useStableFn

Creates a stable function reference that always points to the latest function implementation while maintaining a consistent reference.

#### Usage

```tsx
import { useStableFn } from "@feutopia/react-hooks";
function MyComponent() {
  const [count, setCount] = useState(0);
  // The function reference remains stable across re-renders
  const handleClick = useStableFn(() => {
    setCount(count + 1);
  });
  return <button onClick={handleClick}>Click me</button>;
}
```

#### Features

- Maintains stable function reference across re-renders
- Preserves function properties
- Supports correct `this` context binding
- Always uses the latest function implementation

#### Parameters

- `fn`: The function to stabilize

#### Returns

- A stable function reference that will always call the latest version of the provided function

## License

MIT
