import { renderHook } from "@testing-library/react";
import { useStableFn } from "../index";

describe("useStableFn", () => {
  it("should maintain stable function reference", () => {
    const fn = vi.fn();
    const { result, rerender } = renderHook(
      ({ callback }) => useStableFn(callback),
      {
        initialProps: { callback: fn },
      }
    );

    const firstRef = result.current;

    // 重新渲染，传入新的函数
    rerender({ callback: vi.fn() });

    // 函数引用应该保持稳定
    expect(result.current).toBe(firstRef);
  });

  it("should call function with correct arguments and context", () => {
    const obj = {
      value: 42,
      fn(x: number) {
        return this.value + x;
      },
    };

    const { result } = renderHook(() => useStableFn(obj.fn));

    // 使用 bind 绑定正确的 this 上下文
    const boundFn = result.current.bind(obj);
    const res = boundFn(8);

    expect(res).toBe(50);
  });

  it("should preserve function properties", () => {
    const fn: any = vi.fn();
    fn.customProp = "test";

    const { result } = renderHook(() => useStableFn(fn));

    expect(result.current.customProp).toBe("test");
  });

  it("should use latest function implementation", () => {
    let counter = 0;
    const { result, rerender } = renderHook(
      ({ callback }) => useStableFn(callback),
      {
        initialProps: { callback: () => counter },
      }
    );

    expect(result.current()).toBe(0);

    counter = 42;
    rerender({ callback: () => counter });

    expect(result.current()).toBe(42);
  });
});
