<script setup lang="ts">
import { delay } from "@feutopia/utils";
import { useRequest } from "./useRequest";

const service = () =>
  new Promise((resolve) => {
    console.log("service========");
    resolve("success");
  });

const init = async () => {
  useRequest(service, {
    cacheKey: "test",
    cacheTime: 100,
    onSuccess: (data) => {
      console.log("111", data);
    },
  });
  await delay(50);
  useRequest(service, {
    cacheKey: "test",
    cacheTime: 100,
    onSuccess: (data) => {
      console.log("222", data);
    },
  });
};

init();
</script>

<template></template>
