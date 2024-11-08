/**
 * 格式化数字，每三位添加一个逗号
 * @param num - 数字
 * @returns 格式化后的数字
 * @example
 * formatNumber(123456789) // "123,456,789"
 */
const thousandsRegex = /\B(?=(\d{3})+(?!\d))/g;
export const formatThousands = (num: number | string) => {
	if (!["number", "string"].includes(typeof num)) return "";
	// 处理 -0 的情况
	if (Object.is(num, -0)) return "0";
	return num.toString().replace(thousandsRegex, ",");
};
