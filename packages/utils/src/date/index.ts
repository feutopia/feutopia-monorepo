import type { DateInfo } from "./type";
import { weekdaysEn, weekdaysCn, monthsEn, monthsCn } from "./const";

// 格式化数字为两位数
export const padZero = (num: number): string => {
  return num < 10 ? `0${num}` : num.toString();
};

// 获取当前日期信息
export function getDateInfo(): DateInfo {
  const date = new Date();
  const weekday = date.getDay();
  return {
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
}

// 获取格式化的时间
export function formatTime(
  dateInfo: DateInfo,
  separator: string = ":"
): string {
  const { hour, minute, second } = dateInfo;
  return [hour, minute, second].map(padZero).join(separator);
}

// 获取格式化的日期
export function formatDate(
  dateInfo: DateInfo,
  separator: string = "-"
): string {
  const { year, month, day } = dateInfo;
  return [year, padZero(month), padZero(day)].join(separator);
}
