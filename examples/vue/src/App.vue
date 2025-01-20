<script setup lang="ts">
import InfiniteList from "./vue-ui/InfiniteList/index.vue";
import Dialog from "./vue-ui/Dialog/index.vue";
import Tabs from "./vue-ui/Tabs/index.tsx";
import LineChart from "./vue-ui/Echarts/LineChart.vue";
import BarChart from "./vue-ui/Echarts/BarChart.vue";
import PieChart from "./vue-ui/Echarts/PieChart.vue";
import "./http/cancelRequest.ts";
</script>

<template>
  <InfiniteList />
  <div style="height: 100px"></div>
  <Dialog />
  <Tabs />
  <LineChart />
  <BarChart />
  <PieChart />
</template>
