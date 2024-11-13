import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useRefExpose } from "../index";

describe("useRefExpose", () => {
  // 测试基本属性访问
  it("should proxy property access to ref value", () => {
    const component = {
      foo: "bar",
      method: () => "hello",
    };
    const instanceRef = ref<any>(component);
    const exposed = useRefExpose(instanceRef);

    expect(exposed.foo).toBe("bar");
    expect(exposed.method()).toBe("hello");
  });

  // 测试 ref 为 null 或 undefined 的情况
  it("should handle null/undefined ref value", () => {
    const instanceRef = ref<any>(null);
    const exposed = useRefExpose(instanceRef);

    expect(exposed.foo).toBeUndefined();

    instanceRef.value = undefined;
    expect(exposed.foo).toBeUndefined();
  });

  // 测试 in 操作符
  it('should support "in" operator', () => {
    const component = {
      foo: "bar",
    };
    const instanceRef = ref<any>(component);
    const exposed = useRefExpose(instanceRef);

    expect("foo" in exposed).toBe(true);
    expect("nonexistent" in exposed).toBe(false);
  });

  // 测试 null/undefined 时的 in 操作符
  it('should handle "in" operator with null/undefined ref value', () => {
    const instanceRef = ref<any>(null);
    const exposed = useRefExpose(instanceRef);

    expect("foo" in exposed).toBe(false);
  });
});
