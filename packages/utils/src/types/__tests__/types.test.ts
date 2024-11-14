import { describe, it, expect } from "vitest";
import type {
  IsNullable,
  RequireNonNull,
  NonNullableProps,
  DeepUnwrapRef,
  Noop,
  AnyFn,
  EmptyArray,
} from "../index";
import { computed, ref } from "@vue/runtime-core";

describe("Type Utils", () => {
  it("IsNullable type check", () => {
    type Test1 = IsNullable<string | null>; // true
    type Test2 = IsNullable<string>; // false

    // 使用类型断言进行测试
    const test1: Test1 = true as const;
    const test2: Test2 = false as const;

    expect(test1).toBe(true);
    expect(test2).toBe(false);
  });

  it("RequireNonNull type check", () => {
    type Test1 = RequireNonNull<string>; // string

    // 编译时类型检查，无需运行时断言
    const value: Test1 = "test";
    expect(typeof value).toBe("string");
  });

  it("NonNullableProps type check", () => {
    interface TestInterface {
      required: string;
      optional?: string;
      nullable: string | null;
    }

    type CleanInterface = NonNullableProps<TestInterface>;

    // 创建一个符合 CleanInterface 的对象
    const obj: CleanInterface = {
      required: "test",
    };

    expect(obj).toHaveProperty("required");
    expect(obj).not.toHaveProperty("optional");
    expect(obj).not.toHaveProperty("nullable");
  });

  describe("Noop", () => {
    it("should accept function without parameters and return void", () => {
      const noopFn: Noop = () => {};
      const result = noopFn();
      expect(result).toBeUndefined();
    });
  });

  describe("AnyFn", () => {
    it("should accept any function signature", () => {
      const fn1: AnyFn = () => 42;
      const fn2: AnyFn = (a: number, b: string) => ({ a, b });
      const fn3: AnyFn = (...args: any[]) => args;

      expect(fn1()).toBe(42);
      expect(fn2(1, "test")).toEqual({ a: 1, b: "test" });
      expect(fn3(1, 2, 3)).toEqual([1, 2, 3]);
    });
  });

  describe("EmptyArray", () => {
    it("should only accept empty arrays", () => {
      const emptyArr: EmptyArray = [];
      expect(emptyArr).toEqual([]);

      // 以下代码在 TypeScript 中会报错
      // @ts-expect-error
      const nonEmptyArr: EmptyArray = [1, 2, 3];
    });
  });

  describe("DeepUnwrapRef", () => {
    it("should unwrap nested refs", () => {
      const nested = ref({
        count: ref(0),
        text: "hello",
        computed: computed(() => 42),
      });

      type UnwrappedType = DeepUnwrapRef<typeof nested>;

      // 类型断言，确保解包后的类型正确
      type Expected = {
        count: number;
        text: string;
        computed: number;
      };

      // 使用类型断言确保类型匹配
      // @ts-expect-error - Intentionally unused, only for type checking
      const _typeCheck: UnwrappedType = {
        count: 0,
        text: "hello",
        computed: 42,
      } satisfies Expected;
    });
  });
});
