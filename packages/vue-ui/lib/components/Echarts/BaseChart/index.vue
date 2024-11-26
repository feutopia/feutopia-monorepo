<script setup lang="ts">
import { tryOnScopeDispose, useResizeObserver } from "@feutopia/vue-hooks";
import type { ECharts } from "echarts/core";
import * as echarts from "echarts/core";
import { onMounted, ref, watchEffect } from "vue";
import { BaseChartProps } from "../type";

const props = defineProps<BaseChartProps>();
let chartInstance: ECharts | null = null;
const chartBox = ref<HTMLElement | null>(null);

useResizeObserver(chartBox, () => {
  chartInstance?.resize();
});

onMounted(() => {
  chartInstance = echarts.init(chartBox.value);
  watchEffect(() => {
    if (props.option) {
      chartInstance?.setOption(props.option);
    }
  });
});

tryOnScopeDispose(() => {
  chartInstance?.dispose();
  chartInstance = null;
});

defineExpose({
  getInstance: () => chartInstance,
});
</script>

<template>
  <div ref="chartBox" class="fe-chart-box"></div>
</template>
