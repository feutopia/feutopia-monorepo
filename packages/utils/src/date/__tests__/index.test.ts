import { describe, it, expect, beforeEach, vi } from "vitest";
import { padZero, getDateInfo, formatTime, formatDate } from "../index";
import { DateInfo } from "../type";

describe("date utils", () => {
  describe("padZero", () => {
    it("should pad single digit with zero", () => {
      expect(padZero(5)).toBe("05");
      expect(padZero(9)).toBe("09");
    });

    it("should not pad double digits", () => {
      expect(padZero(10)).toBe("10");
      expect(padZero(99)).toBe("99");
    });
  });

  describe("getDateInfo", () => {
    beforeEach(() => {
      // Mock a specific date: 2024-03-15 14:30:45
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2024, 2, 15, 14, 30, 45));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return correct date information", () => {
      const dateInfo = getDateInfo();

      expect(dateInfo.year).toBe(2024);
      expect(dateInfo.month).toBe(3);
      expect(dateInfo.day).toBe(15);
      expect(dateInfo.dayStr).toBe("15");
      expect(dateInfo.hour).toBe(14);
      expect(dateInfo.hourStr).toBe("14");
      expect(dateInfo.minute).toBe(30);
      expect(dateInfo.minuteStr).toBe("30");
      expect(dateInfo.second).toBe(45);
      expect(dateInfo.secondStr).toBe("45");
      expect(dateInfo.weekdayEn).toBe("Friday");
      expect(dateInfo.weekdayCn).toBe("星期五");
      expect(dateInfo.monthEn).toBe("March");
      expect(dateInfo.monthCn).toBe("三月");
    });
  });

  describe("formatTime", () => {
    it("should format time correctly with default separator", () => {
      const dateInfo = {
        hour: 14,
        minute: 5,
        second: 9,
      } as DateInfo;

      expect(formatTime(dateInfo)).toBe("14:05:09");
    });

    it("should format time with custom separator", () => {
      const dateInfo = {
        hour: 14,
        minute: 5,
        second: 9,
      } as DateInfo;

      expect(formatTime(dateInfo, "-")).toBe("14-05-09");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly with default separator", () => {
      const dateInfo = {
        year: 2024,
        month: 3,
        day: 15,
      } as DateInfo;

      expect(formatDate(dateInfo)).toBe("2024-03-15");
    });

    it("should format date with custom separator", () => {
      const dateInfo = {
        year: 2024,
        month: 3,
        day: 15,
      } as DateInfo;

      expect(formatDate(dateInfo, "/")).toBe("2024/03/15");
    });
  });
});
