<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

const num = ref(0);

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
  color: yellow;
}
button {
  display: block;
  width: 100px;
  height: 20px;
  margin: 10px 0;
}
</style>
