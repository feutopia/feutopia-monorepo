import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import BarChart from "../index.vue";
import { useRegisterBarChartComp } from "@/hooks/useRegisterBarChartComp";

// Mock the registration hook
vi.mock("@/hooks/useRegisterBarChartComp", () => ({
  useRegisterBarChartComp: vi.fn(),
}));

// Mock BaseChart component
vi.mock("../../BaseChart/index.vue", () => ({
  default: {
    name: "BaseChart",
    template: '<div class="mock-base-chart"></div>',
  },
}));

describe("BarChart", () => {
  it("should register bar chart components on mount", () => {
    mount(BarChart);
    expect(useRegisterBarChartComp).toHaveBeenCalled();
  });

  it("should render BaseChart component", () => {
    const wrapper = mount(BarChart);
    expect(wrapper.find(".mock-base-chart").exists()).toBe(true);
  });
});
