/**
 * 注册饼图组件
 */
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { useRegisterChartComp } from "./useRegisterChartComp";

export function useRegisterPieChartComp() {
  useRegisterChartComp();
  echarts.use([PieChart]);
}
