/**
 * 注册折线图组件
 */
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { useRegisterChartComp } from "./useRegisterChartComp";

export function useRegisterLineChartComp() {
  useRegisterChartComp();
  echarts.use([LineChart]);
}
