/**
 * 截断字符串，如果字符串长度超过 maxLength，则截断并添加省略号
 * @param str - 字符串
 * @param maxLength - 最大长度
 * @returns 截断后的字符串
 * @example
 * truncate("Hello, world!", 10) // "Hello, wo..."
 */
export const truncate = (str: string, maxLength: number) =>
	str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
