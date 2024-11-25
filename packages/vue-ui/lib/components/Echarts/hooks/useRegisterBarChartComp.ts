/**
 * 注册柱状图组件
 */
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import { useRegisterChartComp } from "./useRegisterChartComp";

export function useRegisterBarChartComp() {
  useRegisterChartComp();
  echarts.use([BarChart]);
}
