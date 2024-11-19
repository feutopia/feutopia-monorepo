/**
 * 获取任意值的具体类型: String, Number, Boolean, Null, Undefined, Symbol, Array, Map, Set, RegExp, Date, Error, Promise, WeakMap, WeakSet, Function
 * @param {any} value - 要检查类型的值
 * @returns {string} - 返回类型字符串
 */
export function getType(value: any) {
  if (value === null) return "null";
  const type = typeof value;
  // 处理基本类型
  if (type === "object") {
    const builtInTypes: Record<string, boolean> = {
      array: Array.isArray(value),
      map: value instanceof Map,
      set: value instanceof Set,
      weakmap: value instanceof WeakMap,
      weakset: value instanceof WeakSet,
      regexp: value instanceof RegExp,
      date: value instanceof Date,
      error: value instanceof Error,
      promise: value instanceof Promise,
    };
    for (const [key, value] of Object.entries(builtInTypes)) {
      if (value) return key;
    }
  }
  return type;
}
