import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useResizeObserver } from "../index";
import { nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import type { Mock } from "vitest";

describe("useResizeObserver", () => {
  let mockObserve: Mock;
  let mockDisconnect: Mock;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    // Mock ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation((_callback) => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return isSupported as true when ResizeObserver is available", () => {
    const el = ref<HTMLElement | null>(null);
    const callback = vi.fn();

    const { isSupported } = useResizeObserver(el, callback);
    expect(isSupported.value).toBe(true);
  });

  it("should observe element when target is provided", () => {
    const el = document.createElement("div");
    const callback = vi.fn();

    useResizeObserver(ref(el), callback);
    expect(mockObserve).toHaveBeenCalledWith(el);
  });

  it("should cleanup observer when component unmounts", async () => {
    const Component = {
      template: '<div ref="el"></div>',
      setup() {
        const el = ref<HTMLElement | null>(null);
        useResizeObserver(el, vi.fn());
        return { el };
      },
    };

    const wrapper = mount(Component);
    // 等待 Vue 初始化完成
    await nextTick();
    // 确保 observer 被创建
    expect(mockObserve).toHaveBeenCalled();

    wrapper.unmount();

    await nextTick();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("should cleanup and reobserve when target changes", async () => {
    const el1 = document.createElement("div");
    const el2 = document.createElement("div");
    const target = ref<HTMLElement | null>(el1);
    const callback = vi.fn();

    useResizeObserver(target, callback);
    expect(mockObserve).toHaveBeenCalledWith(el1);

    target.value = el2;
    await nextTick();

    expect(mockDisconnect).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledWith(el2);
  });

  it("should stop watching when stop is called", () => {
    const el = document.createElement("div");
    const target = ref<HTMLElement | null>(el);
    const callback = vi.fn();

    const { stop } = useResizeObserver(target, callback);
    stop();

    target.value = document.createElement("div");
    expect(mockObserve).toHaveBeenCalledTimes(1); // Only initial observation
  });
});
