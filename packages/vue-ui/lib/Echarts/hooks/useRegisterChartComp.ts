import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
} from "echarts/components";
import { LineChart, PieChart, BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

export function useRegisterChartComp() {
  echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    ToolboxComponent,
    LineChart,
    PieChart,
    BarChart,
    CanvasRenderer,
  ]);
}
