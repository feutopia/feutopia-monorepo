import type { EChartsOption } from "echarts";
export type { EChartsOption };
export type BaseChartProps = {
  option?: EChartsOption;
};
import type LineChart from "./LineChart/index.vue";
export type LineChartInstance = InstanceType<typeof LineChart>;
import type BarChart from "./BarChart/index.vue";
export type BarChartInstance = InstanceType<typeof BarChart>;
import type PieChart from "./PieChart/index.vue";
export type PieChartInstance = InstanceType<typeof PieChart>;
