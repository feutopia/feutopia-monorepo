import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BaseChart from "../index.vue";

// Mock must be defined before any imports
vi.mock("echarts/core", () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
  })),
}));

describe("BaseChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // 模拟DOM元素尺寸
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 100,
      bottom: 100,
      toJSON: vi.fn(),
    }));
  });

  it("should initialize chart on mount", async () => {
    const wrapper = mount(BaseChart, {
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const echarts = await import("echarts/core");
    expect(echarts.init).toHaveBeenCalled();
  });

  it("should set option when prop changes", async () => {
    const testOption = { title: { text: "Test Chart" } };
    const wrapper = mount(BaseChart, {
      props: {
        option: testOption,
      },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const echarts = await import("echarts/core");
    const mockChart = (echarts.init as any).mock.results[0].value;
    expect(mockChart.setOption).toHaveBeenCalledWith(testOption);
  });

  it("should expose getInstance method", async () => {
    const wrapper = mount(BaseChart, {
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const instance = wrapper.vm.getInstance();
    expect(instance).toBeDefined();
    expect(instance?.setOption).toBeDefined();
  });
});
