/**
 * 合并对象，source 中的属性会覆盖 target 中的属性
 * @param target - 目标对象
 * @param source - 源对象
 * @returns 合并后的对象
 * @example
 * mergeObjectPartial({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
 */
export function mergeObjectPartial<T>(target: T, source: Partial<T>) {
	return { ...target, ...source };
}
