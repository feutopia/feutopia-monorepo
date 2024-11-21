import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useNamespace } from "../index";

describe("useNamespace", () => {
  it("should generate basic block class name", () => {
    const ns = useNamespace("button");
    expect(ns.b()).toBe("fe-button");
    expect(ns.b("primary")).toBe("fe-button-primary");
  });

  it("should generate element class name", () => {
    const ns = useNamespace("button");
    expect(ns.e("label")).toBe("fe-button__label");
    expect(ns.e()).toBe("");
  });

  it("should generate modifier class name", () => {
    const ns = useNamespace("button");
    expect(ns.m("disabled")).toBe("fe-button--disabled");
    expect(ns.m()).toBe("");
  });

  it("should generate block-element class name", () => {
    const ns = useNamespace("button");
    expect(ns.be("primary", "label")).toBe("fe-button-primary__label");
    expect(ns.be()).toBe("");
  });

  it("should generate element-modifier class name", () => {
    const ns = useNamespace("button");
    expect(ns.em("label", "disabled")).toBe("fe-button__label--disabled");
    expect(ns.em()).toBe("");
  });

  it("should generate block-modifier class name", () => {
    const ns = useNamespace("button");
    expect(ns.bm("primary", "disabled")).toBe("fe-button-primary--disabled");
    expect(ns.bm()).toBe("");
  });

  it("should generate block-element-modifier class name", () => {
    const ns = useNamespace("button");
    expect(ns.bem("primary", "label", "disabled")).toBe(
      "fe-button-primary__label--disabled"
    );
    expect(ns.bem()).toBe("");
  });

  it("should generate is-* class name", () => {
    const ns = useNamespace("button");
    expect(ns.is("disabled")).toBe("is-disabled");
    expect(ns.is("disabled", true)).toBe("is-disabled");
    expect(ns.is("disabled", false)).toBe("");
  });

  it("should generate css vars", () => {
    const ns = useNamespace("button");
    expect(ns.cssVar({ color: "red" })).toEqual({
      "--fe-color": "red",
    });
    expect(ns.cssVarBlock({ color: "red" })).toEqual({
      "--fe-button-color": "red",
    });
  });

  it("should generate css var names", () => {
    const ns = useNamespace("button");
    expect(ns.cssVarName("color")).toBe("--fe-color");
    expect(ns.cssVarBlockName("color")).toBe("--fe-button-color");
  });

  it("should work with custom namespace", () => {
    const customNamespace = ref("custom");
    const ns = useNamespace("button", customNamespace);
    expect(ns.b()).toBe("custom-button");
    expect(ns.e("label")).toBe("custom-button__label");
    expect(ns.m("disabled")).toBe("custom-button--disabled");
  });
});
