import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { nextTick, ref } from "vue";
import { useInterval } from "../index";

describe("useInterval", () => {
  beforeEach(() => {
    // 设置虚拟定时器
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 清理虚拟定时器
    vi.restoreAllMocks();
  });

  it("should call callback with specified interval", () => {
    const callback = vi.fn();
    const { isActive } = useInterval(callback, 1000);

    // 验证初始状态
    expect(isActive.value).toBe(true);
    expect(callback).not.toHaveBeenCalled();

    // 推进时间，验证回调被调用
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("should call callback immediately when immediate option is true", () => {
    const callback = vi.fn();
    useInterval(callback, 1000, { immediate: true });

    // 验证callback是否立即执行
    expect(callback).toHaveBeenCalledTimes(1);

    // 推进时间，验证之后的调用
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should pause and resume interval", () => {
    const callback = vi.fn();
    const { pause, resume, isActive } = useInterval(callback, 1000);

    // 初始状态检查
    expect(isActive.value).toBe(true);

    // 暂停定时器
    pause();
    expect(isActive.value).toBe(false);

    // 暂停期间不应该调用callback
    vi.advanceTimersByTime(2000);
    expect(callback).not.toHaveBeenCalled();

    // 恢复定时器
    resume();
    expect(isActive.value).toBe(true);

    // 恢复后应该正常调用
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should update interval when ref value changes", async () => {
    const callback = vi.fn();
    const interval = ref(1000);
    useInterval(callback, interval);

    // 初始间隔
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    // 更改间隔为500ms
    interval.value = 500;

    await nextTick();

    // 因为新的计时器会在变化后立即启动，所以500ms后会触发
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(2);

    // 再等待500ms，验证新的间隔是否持续生效
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("should clean up interval on unmount", () => {
    const callback = vi.fn();
    const { pause } = useInterval(callback, 1000);

    // 模拟组件卸载
    pause();

    // 推进时间，验证回调不再被调用
    vi.advanceTimersByTime(2000);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should maintain consistent interval after changes", async () => {
    const callback = vi.fn();
    const interval = ref(1000);
    useInterval(callback, interval);

    // 初始间隔触发
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    // 改变间隔为500ms
    interval.value = 500;

    await nextTick();

    // 第一个500ms
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(2);

    // 连续多个500ms间隔
    vi.advanceTimersByTime(1500); // 3个500ms
    expect(callback).toHaveBeenCalledTimes(5);
  });
});
