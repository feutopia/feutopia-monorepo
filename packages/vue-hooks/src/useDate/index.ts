import { useInterval } from "@/useInterval";
import {
  getDateInfo,
  type DateInfo,
  formatTime as formatTimeFn,
  formatDate as formatDateFn,
  DropParams,
} from "@feutopia/utils";
import { ref } from "vue";

export function useDate() {
  const dateInfo = ref<DateInfo>(getDateInfo());

  const updateTime = () => {
    dateInfo.value = getDateInfo();
  };

  useInterval(updateTime, 1000);

  const formatTime = (...args: DropParams<typeof formatTimeFn>) => {
    return formatTimeFn(dateInfo.value, ...args);
  };

  const formatDate = (...args: DropParams<typeof formatDateFn>) => {
    return formatDateFn(dateInfo.value, ...args);
  };

  return {
    dateInfo,
    formatTime,
    formatDate,
  };
}
