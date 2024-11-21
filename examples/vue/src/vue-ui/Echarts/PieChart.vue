<script setup lang="ts">
import { onMounted, ref } from "vue";
import PieChart from "../components/PieChart/index.vue";
import type { EChartsOption, PieChartInstance } from "../../dist/types";

const option = ref<EChartsOption>();
setTimeout(() => {
  option.value = {
    title: {
      text: "Pie Chart",
    },
    series: [
      {
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
        type: "pie",
      },
    ],
  };
}, 0);

const refPieChart = ref<PieChartInstance>();
onMounted(() => {
  console.log(refPieChart.value?.getInstance());
});
</script>

<template>
  <PieChart :option="option" class="base-chart" ref="refPieChart" />
</template>

<style scoped>
.base-chart {
  height: 400px;
}
</style>
