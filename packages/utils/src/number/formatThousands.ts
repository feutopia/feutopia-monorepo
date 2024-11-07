/**
 * 格式化数字，每三位添加一个逗号
 * @param num - 数字
 * @returns 格式化后的数字
 * @example
 * formatNumber(123456789) // "123,456,789"
 */
export const formatThousands = (() => {
	const thousandsRegex = /\B(?=(\d{3})+(?!\d))/g;
	return (num: number) => num.toLocaleString().replace(thousandsRegex, ",");
})();
