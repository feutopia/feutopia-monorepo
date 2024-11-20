import { getDateInfo } from "@feutopia/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDate } from "../index";

describe("useDate", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
    // 设置一个固定的时间点
    vi.setSystemTime(new Date("2024-03-20 14:30:45"));
  });

  it("should initialize with current date info", () => {
    const { dateInfo } = useDate();
    expect(dateInfo.value).toEqual(getDateInfo());
  });

  it("should update dateInfo every second", () => {
    const { dateInfo } = useDate();
    const initialDate = dateInfo.value;

    vi.advanceTimersByTime(1000);
    expect(dateInfo.value.timestamp).toBeGreaterThan(initialDate.timestamp);
  });

  it("should format time correctly", () => {
    const { formatTime } = useDate();
    const result = formatTime();
    expect(result).toBe("14:30:45");
  });

  it("should format time with custom separator", () => {
    const { formatTime } = useDate();
    const result = formatTime("-");
    expect(result).toBe("14-30-45");
  });

  it("should format date correctly", () => {
    const { formatDate } = useDate();
    const result = formatDate();
    expect(result).toBe("2024-03-20");
  });

  it("should format date with custom separator", () => {
    const { formatDate } = useDate();
    const result = formatDate("/");
    expect(result).toBe("2024/03/20");
  });
});
