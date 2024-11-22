import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import LineChart from "../index.vue";
import { useRegisterLineChartComp } from "../../hooks/useRegisterLineChartComp";

// Mock the registration hook
vi.mock("../../hooks/useRegisterLineChartComp", () => ({
  useRegisterLineChartComp: vi.fn(),
}));

// Mock BaseChart component
vi.mock("../../BaseChart/index.vue", () => ({
  default: {
    name: "BaseChart",
    template: '<div class="mock-base-chart"></div>',
  },
}));

describe("LineChart", () => {
  it("should register line chart components on mount", () => {
    mount(LineChart);
    expect(useRegisterLineChartComp).toHaveBeenCalled();
  });

  it("should render BaseChart component", () => {
    const wrapper = mount(LineChart);
    expect(wrapper.find(".mock-base-chart").exists()).toBe(true);
  });
});
