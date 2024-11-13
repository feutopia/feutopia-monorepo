# @feutopia/vue-echarts

**English** | [中文](./README.zh-CN.md)

[![npm version](https://badge.fury.io/js/@feutopia%2Fvue-echarts.svg)](https://badge.fury.io/js/@feutopia%2Fvue-echarts)
[![License](https://img.shields.io/npm/l/@feutopia/vue-echarts.svg)](https://github.com/feutopia/vue-echarts/blob/main/LICENSE)

A Vue.js component library for Apache ECharts.

## Features

- 📦 Out-of-the-box chart components
- 🎨 Based on Apache ECharts
- 💪 Written in TypeScript
- 🔧 Highly customizable
- 🚀 Lightweight and efficient

## Installation

```bash
pnpm install @feutopia/vue-echarts
```

## Usage

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import { LineChart } from "@feutopia/vue-echarts";
import type { EChartsOption } from "@feutopia/vue-echarts";
const option = ref<EChartsOption>({
  title: {
    text: "Line Chart",
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: "line",
    },
  ],
});
</script>
<template>
  <LineChart :option="option" class="chart" />
</template>
<style scoped>
.chart {
  height: 400px;
}
</style>
```

### Available Components

- `LineChart`: For line charts
- `BarChart`: For bar charts
- `PieChart`: For pie charts

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| option | `EChartsOption` | - | The configuration object for ECharts |

## Methods

Each chart component exposes the following methods through ref:

| Method | Description |
|--------|-------------|
| getInstance | Returns the ECharts instance |

## License

[MIT](./LICENSE)
