<script setup lang="ts">
import { ref } from "vue";
import Dialog from "../../components/Dialog/index.vue";

const dialogRef = ref<InstanceType<typeof Dialog>>();
</script>

<template>
  <div class="container">
    <Dialog ref="dialogRef">
      <div class="box">Dialog</div>
      啦啦啦
    </Dialog>
    <button @click="dialogRef?.open()">打开对话框</button>
  </div>
</template>

<style scoped>
.box {
  width: 200px;
  height: 200px;
  background-color: red;
  color: yellow;
}
</style>
