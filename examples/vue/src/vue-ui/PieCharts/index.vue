<script setup lang="ts">
import { shallowRef } from "vue";
import { PieChart, type EChartsOption } from "@feutopia/vue-ui";
import { generateChartOption as generateChannelChartOption } from "./ChannelPieChart/option";
import { generateChartOption as generateAccountChartOption } from "./AccountPieChart/option";

const channelOption = shallowRef<EChartsOption>(
  generateChannelChartOption([
    // { value: 8, name: "临柜" },
    // { value: 1, name: "智慧通" },
    { value: 100, name: "Search Engine" },
    { value: 10, name: "Direct" },
    { value: 1, name: "Direct" },
  ])
);

const accountOption = shallowRef<EChartsOption>(
  generateAccountChartOption([
    // { value: 1, name: "资金开户" },
    // { value: 20, name: "证券开户" },
    { value: 1, name: "Email" },
    { value: 10, name: "Direct" },
    { value: 100, name: "Union Ads" },
  ])
);
</script>

<template>
  <div class="box">
    <PieChart :option="channelOption" class="chart" />
    <PieChart :option="accountOption" class="chart" />
  </div>
</template>

<style scoped>
.box {
  background: #040e32;
  padding: 20px 0;
  height: 200px;
  display: flex;
}

.chart {
  flex: 1;
  height: 100%;
}
</style>
