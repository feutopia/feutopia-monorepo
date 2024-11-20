// 辅助类型：构建指定长度的元组
type BuildArray<
  Length extends number,
  Arr extends unknown[] = [],
> = Arr["length"] extends Length ? Arr : BuildArray<Length, [...Arr, unknown]>;

// 辅助类型：移除元组前 N 个元素
type DropTuple<T extends any[], N extends number> =
  BuildArray<N> extends [...any[]]
    ? T extends [...BuildArray<N>, ...infer Rest]
      ? Rest
      : []
    : never;

/**
 * 移除函数参数的 N 个参数
 * @param Fn - 函数
 * @param Count - 移除的参数个数
 * @returns 移除参数后的元组
 */
export type DropParams<
  Fn extends (...args: any[]) => any,
  Count extends number = 1,
> = DropTuple<Parameters<Fn>, Count>;
