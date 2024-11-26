# React UI Components

**English** | [中文](https://github.com/feutopia/feutopia-monorepo/blob/main/packages/react-ui/README.zh-CN.md)

A lightweight React UI component library featuring Dialog and Show components.

## Features

- 🚀 Built with React 18+
- 💪 Written in TypeScript
- 📦 Tree-shaking support
- 🔧 Simple and intuitive API
- ⚡️ Lightweight and performant
- 🧪 Comprehensive test coverage
- 📚 Detailed documentation

## Installation

```bash
npm install @feutopia/react-ui
```

## Components

### Show Component

A versatile component for conditional rendering, similar to Vue's v-if and v-show directives.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| if | boolean | true | Controls whether the component is rendered (like v-if) |
| show | boolean | true | Controls component visibility (like v-show) |
| as | ElementType | 'div' | HTML element type to render |
| className | string | - | Custom CSS class |
| style | CSSProperties | - | Inline styles |
| onClick | function | - | Click event handler |

##### Example

```tsx
import { Show } from '@feutopia/react-ui';

// Conditional rendering
<Show if={condition}>
  <div>Only renders when condition is true</div>
</Show>

// Toggle visibility
<Show show={isVisible}>
  <div>Toggles display: none</div>
</Show>

// Custom element
<Show as="section" className="custom-class">
  <div>Renders as a section element</div>
</Show>
```

### Dialog Component

A flexible modal dialog component with mask support and transition effects.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| open | boolean | false | Controls dialog visibility |
| mask | boolean | true | Shows/hides the backdrop mask |
| maskClosable | boolean | true | Allows closing by clicking mask |
| destroyOnClose | boolean | false | Unmounts content on close |
| className | string | - | Dialog container class |
| maskClass | string | - | Mask class |
| contentClass | string | - | Content wrapper class |
| style | CSSProperties | - | Dialog container style |
| maskStyle | CSSProperties | - | Mask style |
| contentStyle | CSSProperties | - | Content wrapper style |

#### Callbacks

- `onOpen`: Triggered when opening starts
- `afterOpen`: Triggered after opening animation
- `onClose`: Triggered when closing starts
- `afterClose`: Triggered after closing animation

#### Example

```tsx
import { Dialog } from "@feutopia/react-ui";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      afterClose={() => console.log("Dialog closed")}
    >
      <div>Dialog Content</div>
    </Dialog>
  );
}
```
