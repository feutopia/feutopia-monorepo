<script setup lang="ts">
import { ref } from "vue";
import BaseChart from "../BaseChart/index.vue";
import { useRefExpose } from "@feutopia/vue-hooks";
import { useRegisterBarChartComp } from "@/hooks/useRegisterBarChartComp";

useRegisterBarChartComp();
const chartBox = ref<InstanceType<typeof BaseChart>>();
defineExpose(useRefExpose(chartBox));
</script>

<template>
  <BaseChart ref="chartBox" />
</template>
