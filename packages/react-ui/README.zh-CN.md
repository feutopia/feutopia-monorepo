# React UI Components

**中文** | [English](./README.md)

一个轻量级的 React UI 组件库，包含 Dialog 和 Show 组件。

## 安装

```bash
npm install @feutopia/react-ui
```

## 组件

### Show 组件

一个用于条件渲染的通用组件，类似于 Vue 的 v-if 和 v-show 指令。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| if | boolean | true | 控制组件是否渲染（类似 v-if） |
| show | boolean | true | 控制组件可见性（类似 v-show） |
| as | ElementType | 'div' | 要渲染的 HTML 元素类型 |
| className | string | - | 自定义 CSS 类名 |
| style | CSSProperties | - | 内联样式 |
| onClick | function | - | 点击事件处理函数 |

#### 示例

```tsx
import { Show } from '@feutopia/react-ui';

// 条件渲染
<Show if={condition}>
	<div>仅在条件为真时渲染</div>
</Show>

// 切换可见性
<Show show={isVisible}>
	<div>通过 display: none 切换显示</div>
</Show>

// 自定义元素
<Show as="section" className="custom-class">
	<div>渲染为 section 元素</div>
</Show>
```

### Dialog 组件

一个灵活的模态对话框组件，支持遮罩层和过渡效果。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| open | boolean | false | 控制对话框可见性 |
| mask | boolean | true | 显示/隐藏背景遮罩 |
| maskClosable | boolean | true | 允许点击遮罩关闭 |
| destroyOnClose | boolean | false | 关闭时卸载内容 |
| className | string | - | 对话框容器类名 |
| maskClass | string | - | 遮罩层类名 |
| contentClass | string | - | 内容包装器类名 |
| style | CSSProperties | - | 对话框容器样式 |
| maskStyle | CSSProperties | - | 遮罩层样式 |
| contentStyle | CSSProperties | - | 内容包装器样式 |

#### 回调函数

- `onOpen`: 开始打开时触发
- `afterOpen`: 打开动画结束后触发
- `onClose`: 开始关闭时触发
- `afterClose`: 关闭动画结束后触发

#### 示例

```tsx
import { Dialog } from "@feutopia/react-ui";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      afterClose={() => console.log("对话框已关闭")}
    >
      <div>对话框内容</div>
    </Dialog>
  );
}
```
