import type { EChartsOption } from "@feutopia/vue-ui";
import { optionColor } from "../common";

type ChartDataItem = {
  name: string;
  value: number;
}[];

const normalizeChartData = (data: ChartDataItem) => {
  const maxValue = Math.max(...data.map((item) => item.value));
  const adjustmentValue = Math.round(maxValue * 0.5);

  return data.map((item) => ({
    name: item.name,
    realValue: item.value,
    value: item.value === 0 ? 0 : item.value + adjustmentValue,
  }));
};

export const generateChartOption = (
  data: ChartDataItem = [],
  scaleFactor: number = 1
) => {
  if (data.length === 0) return {};

  const outerBorderRadius = ["100%", "100%"];
  const chartRadius = ["25%", "98%"];
  const centerCircleRadius = ["0%", "25%"];

  const disabledInteraction = {
    emphasis: {
      disabled: true,
    },
    cursor: "auto",
    silent: true,
  };

  const processedData = normalizeChartData(data);

  const option: EChartsOption = {
    color: optionColor,
    tooltip: {
      show: false,
    },
    series: [
      /*************** 外边框 ***************/
      {
        ...disabledInteraction,
        name: "外边框",
        type: "pie",
        radius: outerBorderRadius,
        itemStyle: {
          borderWidth: 1,
          borderColor: "#2985e0",
          color: "transparent",
        },
        data: [{ value: 0 }],
      },

      /*************** 数据饼图 ***************/
      {
        ...disabledInteraction,
        name: "数据饼图",
        type: "pie",
        radius: chartRadius,
        roseType: "area",
        label: {
          position: "inside",
          formatter: (params) => {
            const dataItem = params.data as (typeof processedData)[number];
            return `{styleRich|${dataItem.realValue}}`;
          },
          rich: {
            styleRich: {
              fontSize: 16 * scaleFactor,
              color: "#FFF",
            },
          },
        },
        data: processedData,
      },

      /*************** 标签引导线 ***************/
      {
        ...disabledInteraction,
        name: "标签引导线",
        type: "pie",
        radius: chartRadius,
        roseType: "area",
        itemStyle: {
          color: "transparent",
        },
        label: {
          position: "outside",
          fontSize: 16 * scaleFactor,
          color: "#fff",
          formatter: "{b}",
        },
        labelLine: {
          length: 0,
          length2: 0,
          lineStyle: {
            width: 1,
            type: "solid",
            color: "#5bbffe",
          },
        },
        data: processedData,
      },

      /*************** 中心黑色圆 ***************/
      {
        ...disabledInteraction,
        name: "中心黑色圆",
        type: "pie",
        radius: centerCircleRadius,
        itemStyle: {
          color: "rgba(0,0,0,0.6)",
        },
        label: {
          position: "center",
          formatter: "{styleRich|账户\n类型}",
          rich: {
            styleRich: {
              fontSize: 15 * scaleFactor,
              lineHeight: 18 * scaleFactor,
              color: "#FFF",
            },
          },
        },
        data: [{ value: 0 }],
      },
    ],
  };

  return option;
};
