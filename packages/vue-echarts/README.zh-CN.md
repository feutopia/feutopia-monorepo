# @feutopia/vue-echarts

**中文** | [English](./README.md)

基于 Apache ECharts 的 Vue.js 图表组件库。

## 特性

- 📦 开箱即用的图表组件
- 🎨 基于 Apache ECharts
- 💪 使用 TypeScript 编写
- 🔧 高度可定制
- 🚀 轻量且高效

## 安装

```bash
pnpm install @feutopia/vue-echarts
```

## 使用

### 基础用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import { LineChart } from "@feutopia/vue-echarts";
import type { EChartsOption } from "@feutopia/vue-echarts";
const option = ref<EChartsOption>({
  title: {
    text: "折线图",
  },
  xAxis: {
    type: "category",
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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

### 可用组件

- `LineChart`: 折线图
- `BarChart`: 柱状图
- `PieChart`: 饼图

## 属性

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| option | `EChartsOption` | - | ECharts 的配置对象 |

## 方法

每个图表组件通过 ref 暴露以下方法：

| 方法 | 说明 |
|------|------|
| getInstance | 返回 ECharts 实例 |

## 许可证

[MIT](./LICENSE)
