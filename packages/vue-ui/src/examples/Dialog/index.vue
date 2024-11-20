<script setup lang="ts">
import { ref } from "vue";
import Dialog from "../../components/Dialog/index.vue";
import Content from "./Content.vue";
import { DialogInstance } from "../../components/Dialog/type";

const dialogRef = ref<DialogInstance>();
</script>

<template>
  <div class="container">
    <Dialog ref="dialogRef">
      <template #default="{ close }">
        <Content />
        <button @click="close">关闭</button>
      </template>
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
