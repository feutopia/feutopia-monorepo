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

/**
 * 判断是否是数组
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是数组
 */
export function isArray(value: any): value is Array<any> {
  return Array.isArray(value);
}

/**
 * 判断是否是 Map
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 Map
 */
export function isMap(value: any): value is Map<any, any> {
  return value instanceof Map;
}

/**
 * 判断是否是 Set
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 Set
 */
export function isSet(value: any): value is Set<any> {
  return value instanceof Set;
}

/**
 * 判断是否是 WeakMap
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 WeakMap
 */
export function isWeakMap(value: any): value is WeakMap<any, any> {
  return value instanceof WeakMap;
}

/**
 * 判断是否是 WeakSet
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 WeakSet
 */
export function isWeakSet(value: any): value is WeakSet<any> {
  return value instanceof WeakSet;
}

/**
 * 判断是否是 RegExp
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 RegExp
 */
export function isRegExp(value: any): value is RegExp {
  return value instanceof RegExp;
}

/**
 * 判断是否是 Date
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 Date
 */
export function isDate(value: any): value is Date {
  return value instanceof Date;
}

/**
 * 判断是否是 Error
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 Error
 */
export function isError(value: any): value is Error {
  return value instanceof Error;
}

/**
 * 判断是否是 Promise
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是 Promise
 */
export function isPromise(value: any): value is Promise<any> {
  return value instanceof Promise;
}

/**
 * 判断是否是对象
 * @param {any} value - 要检查的值
 * @returns {boolean} - 返回是否是对象
 */
export function isObject(value: any): value is Record<string, any> {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
}

/**
 * 判断是否是纯粹的对象
 * @param {any} obj - 要检查的对象
 * @returns {boolean} - 返回是否是纯粹的对象
 */
export function isPlainObject(obj: any): obj is Record<string, any> {
  if (typeof obj !== "object" || obj === null) return false;
  const proto = Object.getPrototypeOf(obj);
  // 必须是直接继承自 Object.prototype 或没有原型 (Object.create(null))
  return proto === null || proto === Object.prototype;
}

/**
 * 判断是否是可迭代的对象
 * @param {any} obj - 要检查的对象
 * @returns {boolean} - 返回是否是可迭代的对象
 */
export function isIterable(obj: any): obj is Iterable<any> {
  return obj != null && typeof obj[Symbol.iterator] === "function";
}
