import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import PieChart from "../index.vue";
import { useRegisterPieChartComp } from "../../hooks/useRegisterPieChartComp";

// Mock the registration hook
vi.mock("../../hooks/useRegisterPieChartComp", () => ({
  useRegisterPieChartComp: vi.fn(),
}));

// Mock BaseChart component
vi.mock("../../BaseChart/index.vue", () => ({
  default: {
    name: "BaseChart",
    template: '<div class="mock-base-chart"></div>',
  },
}));

describe("PieChart", () => {
  it("should register pie chart components on mount", () => {
    mount(PieChart);
    expect(useRegisterPieChartComp).toHaveBeenCalled();
  });

  it("should render BaseChart component", () => {
    const wrapper = mount(PieChart);
    expect(wrapper.find(".mock-base-chart").exists()).toBe(true);
  });
});
