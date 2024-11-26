import { CreateWeakMap } from "../createWeakMap";
import { describe, it, expect } from "vitest";

describe("CreateWeakMap", () => {
  it("should create an empty WeakMap", () => {
    const map = CreateWeakMap();
    expect(map).toBeDefined();
  });

  it("should create a WeakMap with initial values", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const initialEntries: [object, number][] = [
      [obj1, 100],
      [obj2, 200],
    ];

    const map = CreateWeakMap(initialEntries);
    expect(map.get(obj1)).toBe(100);
    expect(map.get(obj2)).toBe(200);
  });

  it("should set and get values", () => {
    const map = CreateWeakMap();
    const key = { id: 1 };
    const value = "test";

    map.set(key, value);
    expect(map.get(key)).toBe(value);
  });

  it("should check if key exists", () => {
    const map = CreateWeakMap();
    const key = { id: 1 };

    expect(map.has(key)).toBe(false);
    map.set(key, "test");
    expect(map.has(key)).toBe(true);
  });

  it("should delete values", () => {
    const map = CreateWeakMap();
    const key = { id: 1 };

    map.set(key, "test");
    expect(map.has(key)).toBe(true);

    map.delete(key);
    expect(map.has(key)).toBe(false);
  });

  it("should clear all values", () => {
    const key1 = { id: 1 };
    const key2 = { id: 2 };
    const map = CreateWeakMap([
      [key1, "test1"],
      [key2, "test2"],
    ]);

    map.clear();
    expect(map.has(key1)).toBe(false);
    expect(map.has(key2)).toBe(false);
  });

  it("should be chainable when setting values", () => {
    const map = CreateWeakMap();
    const key1 = { id: 1 };
    const key2 = { id: 2 };

    map.set(key1, "test1").set(key2, "test2");

    expect(map.get(key1)).toBe("test1");
    expect(map.get(key2)).toBe("test2");
  });
});
