<script setup lang="ts">
import { ref } from "vue";
import BaseChart from "../BaseChart/index.vue";
import { useRegisterLineChartComp } from "../hooks/useRegisterLineChartComp";
import { useRefExpose } from "@feutopia/vue-hooks";

useRegisterLineChartComp();
const chartBox = ref<InstanceType<typeof BaseChart>>();
defineExpose(useRefExpose(chartBox));
</script>

<template>
  <BaseChart ref="chartBox" />
</template>
