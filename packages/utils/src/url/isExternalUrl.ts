/**
 * 判断是否为外部链接
 * @param url - URL 字符串
 * @returns 是否为外部链接（即非站内路由的链接）
 * @example
 * isExternalUrl("https://www.example.com") // true
 * isExternalUrl("/about") // false
 * isExternalUrl("mailto:test@example.com") // true
 */
const externalUrlPattern = /^(https?:|mailto:|tel:|\/\/)/;
export const isExternalUrl = (url: string) => {
	if (typeof url !== "string") return false;
	return externalUrlPattern.test(url);
};
