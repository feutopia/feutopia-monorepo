<script setup lang="ts">
import { faker } from "@faker-js/faker";
import { ref } from "vue";
import { InfiniteList } from "@feutopia/vue-ui";
import Item from "./Item.vue";

let uid = 1;

const listData = ref<{ value: string; uid: number }[]>([]);

const loading = ref(false);

function loadMore() {
  let j = 5;
  while (j--) {
    listData.value = [
      ...listData.value,
      {
        uid: uid++,
        value: faker.lorem.sentences(),
      },
    ];
  }
}

const handleScrollBottom = () => {
  loading.value = true;
  setTimeout(() => {
    loadMore();
    loading.value = false;
  }, 1000);
};

const remove = (uid: number) => {
  listData.value = listData.value.filter((item) => item.uid !== uid);
};

function init() {
  let i = 10;
  while (i--) {
    listData.value.push({
      uid: uid++,
      value: faker.lorem.sentences(),
    });
  }
}

init();
</script>

<template>
  <div class="box">
    <InfiniteList
      :items="listData"
      :itemSize="100"
      @scrollBottom="handleScrollBottom"
    >
      <template #default="{ item }">
        <Item v-bind="item" @remove="remove"></Item>
      </template>
      <template #extra>
        <div v-if="loading" class="loading">loading...</div>
      </template>
    </InfiniteList>
  </div>
</template>

<style scoped>
.box {
  height: 450px;
  border: 4px solid red;
}

.loading {
  text-align: center;
  font-size: 22px;
  color: green;
  padding: 10px 0;
}
</style>
