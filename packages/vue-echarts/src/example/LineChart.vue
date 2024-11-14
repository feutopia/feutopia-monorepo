<script setup lang="ts">
import { onMounted, ref } from "vue";
import LineChart from "../components/LineChart/index.vue";
import type { EChartsOption, LineChartInstance } from "../../dist/types";

const option = ref<EChartsOption>();
setTimeout(() => {
  option.value = {
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
  };
}, 0);

const refLineChart = ref<LineChartInstance>();
onMounted(() => {
  console.log(refLineChart.value?.getInstance());
});
</script>

<template>
  <LineChart :option="option" class="base-chart" ref="refLineChart" />
</template>

<style scoped>
.base-chart {
  height: 400px;
}
</style>
