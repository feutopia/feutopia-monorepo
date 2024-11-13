# Vue UI Component Library

**English** | [中文](https://github.com/feutopia/feutopia-monorepo/blob/main/packages/vue-ui/README.zh-CN.md)

A modern Vue 3 UI component library with TypeScript support.

## Features

- 🚀 Vue 3 Composition API
- 💪 Written in TypeScript
- 📦 Tree-shakeable
- 🔧 Easy to use
- ⚡️ Lightweight and performant
- 🧪 Well-tested with high coverage
- 📚 Comprehensive documentation

## Installation

```bash
pnpm add @feutopia/vue-ui
```

## Usage

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
