/**
 * 截断字符串，如果字符串长度超过 maxLength，则截断并添加省略号
 * @param str - 字符串
 * @param maxLength - 最大长度
 * @param suffix - 省略号，默认为 "..."
 * @returns 截断后的字符串
 * @example
 * truncate("Hello", 2) // "He..."
 */
const TRIM_END_REG = /\s+$/;
export const truncate = (str: any, maxLength: number, suffix = "...") => {
	// 如果是 null 或 undefined，返回空字符串
	if ([null, undefined].includes(str)) return "";
	// 将输入转换为字符串, 因为 str 可能为数字
	const text = String(str);
	// 如果最大长度小于等于 0 或小于等于省略号长度，返回省略号
	if (maxLength <= 0 || maxLength < suffix.length) return suffix;
	return text.length > maxLength
		? text.slice(0, maxLength).replace(TRIM_END_REG, "") + suffix
		: text;
};
