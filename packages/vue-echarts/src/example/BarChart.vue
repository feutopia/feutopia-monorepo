<script setup lang="ts">
import { onMounted, ref } from "vue";
import BarChart from "../components/BarChart/index.vue";
import type { EChartsOption } from "../../dist/types";

const option = ref<EChartsOption>();
setTimeout(() => {
  option.value = {
    title: {
      text: "Bar Chart",
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
        type: "bar",
      },
    ],
  };
}, 0);

const refBarChart = ref<InstanceType<typeof BarChart>>();
onMounted(() => {
  console.log(refBarChart.value?.getInstance());
});
</script>

<template>
  <BarChart :option="option" class="base-chart" ref="refBarChart" />
</template>

<style scoped>
.base-chart {
  height: 400px;
}
</style>
