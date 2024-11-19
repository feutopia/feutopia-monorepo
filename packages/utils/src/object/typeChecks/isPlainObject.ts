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
