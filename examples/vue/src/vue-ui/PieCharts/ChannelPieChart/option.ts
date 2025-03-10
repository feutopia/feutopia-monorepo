import { EChartsOption } from "@feutopia/vue-ui";
import { optionColor } from "../common";

type ChartDataItem = {
  name: string;
  value: number;
}[];

const prepareChartData = (data: ChartDataItem) => {
  const chartColorPalette = [
    { color: "rgba(2,120,231,0.55)" },
    { color: "rgba(52,209,96,0.55)" },
    { color: "rgba(138,0,225,0.55)" },
    { color: "rgba(241,150,16,0.55)" },
  ];

  const maxValue = Math.max(...data.map((item) => item.value));
  const adjustmentValue = Math.round(maxValue * 0.5);

  return data
    .map((item, index) => ({
      name: item.name,
      value: item.value === 0 ? 0 : item.value + adjustmentValue,
      realValue: item.value,
      itemStyle: chartColorPalette[index],
    }))
    .reverse();
};

export const generateChartOption = (
  data: ChartDataItem = [],
  scaleFactor: number = 1
) => {
  if (data.length === 0) return {};

  const outerBorderRadius = ["0%", "100%"];
  const semiTransparentBlueRadius = ["0%", "70%"];
  const chartRadius = ["25%", "70%"];
  const centerCircleRadius = ["0%", "25%"];

  const disabledInteraction = {
    emphasis: {
      disabled: true,
    },
    cursor: "auto",
    silent: true,
  };

  const totalValue = data.reduce((acc, item) => acc + item.value, 0);
  const processedData = prepareChartData(data);

  const borderChartData = processedData.map((item) => ({
    ...item,
    itemStyle: {},
  }));

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
        label: {
          position: "inner",
          formatter: (params) => {
            const value = (params as any).data.realValue;
            return `{styleRich|${value}}`;
          },
          rich: {
            styleRich: {
              fontSize: 16 * scaleFactor,
              color: "#FFF",
            },
          },
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: "#2985e0",
          color: "rgba(1,26,97,0)",
        },
        data: borderChartData,
      },

      /*************** 半透明蓝色圆 ***************/
      {
        ...disabledInteraction,
        name: "半透明蓝色圆",
        type: "pie",
        radius: semiTransparentBlueRadius,
        itemStyle: {
          borderWidth: 1,
          borderColor: "#2985e0",
          color: "rgba(1,26,97,0.9)",
        },
        data: [{ value: 0 }],
      },

      /*************** 数据饼图 ***************/
      {
        ...disabledInteraction,
        name: "数据饼图",
        type: "pie",
        radius: chartRadius,
        roseType: "radius",
        label: {
          position: "outer",
          formatter: (params) => {
            const dataItem = params.data as (typeof processedData)[number];
            const percentage = (
              (dataItem.realValue / totalValue) *
              100
            ).toFixed(2);
            return `{styleRich|${params.name}\n(${percentage}%)} `;
          },
          rich: {
            styleRich: {
              color: "#fff",
              fontSize: 16 * scaleFactor,
              lineHeight: 20 * scaleFactor,
            },
          },
        },
        labelLine: {
          show: true,
          length: 0,
          lineStyle: {
            color: "#fff",
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
          // formatter: "{styleRich|渠道}",
          formatter: "{styleRich|站点}",
          rich: {
            styleRich: {
              fontSize: 16 * scaleFactor,
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
