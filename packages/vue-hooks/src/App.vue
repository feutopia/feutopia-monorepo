<script setup lang="ts">
import { useDate } from "./useDate";

const { dateInfo, getFormattedDate, getFormattedTime } = useDate();
</script>

<template>
  <div>年:{{ dateInfo.year }}</div>
  <div>月:{{ dateInfo.month }}</div>
  <div>日:{{ dateInfo.day }}</div>
  <div>时:{{ dateInfo.hour }}</div>
  <div>分:{{ dateInfo.minute }}</div>
  <div>秒:{{ dateInfo.second }}</div>
  <div>星期:{{ dateInfo.weekdayCn }}</div>
  <div>Weekday:{{ dateInfo.weekdayEn }}</div>
  <div>时间戳:{{ dateInfo.timestamp }}</div>
  <div>{{ getFormattedDate() }}</div>
  <div>{{ getFormattedTime() }}</div>
</template>
