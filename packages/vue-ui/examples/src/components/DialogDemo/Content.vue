<script setup lang="ts">
import { onBeforeUnmount, ref, watchEffect } from "vue";

const num = ref(0);

watchEffect(() => {
  console.log(num.value);
});

onBeforeUnmount(() => {
  console.log("onBeforeUnmount");
});
</script>

<template>
  <div class="number">{{ num }}</div>
  <button @click="num++">增加</button>
</template>

<style scoped>
.number {
  font-size: 50px;
}
</style>
