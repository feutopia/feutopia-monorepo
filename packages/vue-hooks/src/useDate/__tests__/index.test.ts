import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDate } from "../";
import { nextTick } from "vue";

describe("useDate", () => {
  beforeEach(() => {
    // 使用固定的时间进行测试
    vi.useFakeTimers();
    const mockDate = new Date("2024-03-20T15:30:45");
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return correct dateInfo", () => {
    const { dateInfo } = useDate();

    expect(dateInfo.value).toMatchObject({
      year: 2024,
      month: 3,
      day: 20,
      dayStr: "20",
      hour: 15,
      hourStr: "15",
      minute: 30,
      minuteStr: "30",
      second: 45,
      secondStr: "45",
      weekdayEn: "Wednesday",
      weekdayCn: "星期三",
      monthEn: "March",
      monthCn: "三月",
    });
  });

  it("should format time correctly", () => {
    const { getFormattedTime } = useDate();

    expect(getFormattedTime()).toBe("15:30:45");
    expect(getFormattedTime("-")).toBe("15-30-45");
  });

  it("should format date correctly", () => {
    const { getFormattedDate } = useDate();

    expect(getFormattedDate()).toBe("2024-03-20");
    expect(getFormattedDate("/")).toBe("2024/03/20");
  });

  it("should update time every second", async () => {
    const { dateInfo } = useDate();

    expect(dateInfo.value.second).toBe(45);

    // 前进 1 秒
    vi.advanceTimersByTime(1000);
    await nextTick();

    expect(dateInfo.value.second).toBe(46);
  });
});
