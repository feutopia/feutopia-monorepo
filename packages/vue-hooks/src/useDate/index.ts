import { useInterval } from "@/useInterval";
import { ref } from "vue";

export interface DateInfo {
  year: number;
  month: number;
  day: number;
  dayStr: string;
  hour: number;
  hourStr: string;
  minute: number;
  minuteStr: string;
  second: number;
  secondStr: string;
  weekdayEn: string;
  weekdayCn: string;
  monthEn: string;
  monthCn: string;
  timestamp: number;
  dateStr: string;
}

const weekdaysEn = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const weekdaysCn = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];
const monthsEn = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthsCn = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];

const defaultDateInfo = {
  year: 0,
  month: 0,
  day: 0,
  dayStr: "",
  hour: 0,
  hourStr: "",
  minute: 0,
  minuteStr: "",
  second: 0,
  secondStr: "",
  weekdayEn: "",
  weekdayCn: "",
  monthEn: "",
  monthCn: "",
  timestamp: 0,
  dateStr: "",
};

export function useDate() {
  const dateInfo = ref<DateInfo>(defaultDateInfo);

  // 格式化数字为两位数
  const padZero = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  const updateTime = () => {
    const date = new Date();
    const weekday = date.getDay();
    dateInfo.value = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      dayStr: padZero(date.getDate()),
      hour: date.getHours(),
      hourStr: padZero(date.getHours()),
      minute: date.getMinutes(),
      minuteStr: padZero(date.getMinutes()),
      second: date.getSeconds(),
      secondStr: padZero(date.getSeconds()),
      weekdayEn: weekdaysEn[weekday],
      weekdayCn: weekdaysCn[weekday],
      monthEn: monthsEn[date.getMonth()],
      monthCn: monthsCn[date.getMonth()],
      timestamp: date.getTime(),
      dateStr: date.toISOString(),
    };
  };

  // 获取格式化的时间
  const getFormattedTime = (separator: string = ":"): string => {
    const { hour, minute, second } = dateInfo.value;
    return [hour, minute, second].map(padZero).join(separator);
  };

  // 获取格式化的日期
  const getFormattedDate = (separator: string = "-"): string => {
    const { year, month, day } = dateInfo.value;
    return [year, padZero(month), padZero(day)].join(separator);
  };

  useInterval(updateTime, 1000, {
    immediate: true,
  });

  return {
    dateInfo,
    getFormattedTime,
    getFormattedDate,
  };
}
