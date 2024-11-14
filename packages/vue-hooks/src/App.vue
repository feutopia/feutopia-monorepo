<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useRequest } from "./useRequest";

const dep = ref(0);
const { loading, run, cancel, cancelled } = useRequest(
  () => {
    return Promise.resolve("success");
  },
  {
    refreshDeps: [dep],
  }
);

const init = async () => {
  run();
  console.log("loading", loading.value, "cancelled", cancelled.value);
  cancel();
  await nextTick();
  console.log("loading", loading.value, "cancelled", cancelled.value);
};

init();
</script>

<template>
  <div>hello</div>
</template>
