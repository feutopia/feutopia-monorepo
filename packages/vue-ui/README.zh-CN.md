# Vue UI 组件库

**中文** | [English](./README.md)

一个现代化的 Vue 3 UI 组件库，支持 TypeScript。

## 特性

- 🚀 使用 Vue 3 Composition API
- 💪 基于 TypeScript 开发
- 📦 支持 Tree-shaking
- 🔧 简单易用
- ⚡️ 轻量且高性能
- 🧪 完善的测试覆盖
- 📚 详尽的文档说明

## 安装

```bash
pnpm add @feutopia/vue-ui
```

## 使用

```vue
<script setup lang="ts">
import { Tabs, TabPane } from "@feutopia/vue-ui";
import "@feutopia/vue-ui/dist/style.css";
</script>
<template>
	<Tabs>
		<TabPane name="1" label="Tab 1">Content of tab 1</TabPane>
		<TabPane name="2" label="Tab 2">Content of tab 2</TabPane>
	</Tabs>
</template>
```
