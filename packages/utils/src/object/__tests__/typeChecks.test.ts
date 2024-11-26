import { describe, expect, it } from "vitest";
import {
  getType,
  isArray,
  isDate,
  isError,
  isFunction,
  isIterable,
  isMap,
  isNonNegativeNumber,
  isNonNegativeValidNumber,
  isNull,
  isNumber,
  isObject,
  isPlainObject,
  isPositiveInteger,
  isPromise,
  isRegExp,
  isSet,
  isUndefined,
  isValidNumber,
  isWeakMap,
  isWeakSet,
} from "../typeChecks";

describe("Type Check Utils", () => {
  describe("getType", () => {
    it("should return correct types for primitive values", () => {
      expect(getType(null)).toBe("null");
      expect(getType(undefined)).toBe("undefined");
      expect(getType(123)).toBe("number");
      expect(getType("string")).toBe("string");
      expect(getType(true)).toBe("boolean");
      expect(getType(Symbol())).toBe("symbol");
    });

    it("should return correct types for built-in objects", () => {
      expect(getType([])).toBe("array");
      expect(getType(new Map())).toBe("map");
      expect(getType(new Set())).toBe("set");
      expect(getType(new WeakMap())).toBe("weakmap");
      expect(getType(new WeakSet())).toBe("weakset");
      expect(getType(/regex/)).toBe("regexp");
      expect(getType(new Date())).toBe("date");
      expect(getType(new Error())).toBe("error");
      expect(getType(Promise.resolve())).toBe("promise");
      expect(getType(() => {})).toBe("function");
      expect(getType({})).toBe("object");
    });
  });

  describe("isArray", () => {
    it("should correctly identify arrays", () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(new Array())).toBe(true);
      expect(isArray({})).toBe(false);
      expect(isArray(null)).toBe(false);
    });
  });

  describe("isDate", () => {
    it("should correctly identify Dates", () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(Date.now())).toBe(false);
      expect(isDate("2024-01-01")).toBe(false);
    });
  });

  describe("isError", () => {
    it("should correctly identify Errors", () => {
      expect(isError(new Error())).toBe(true);
      expect(isError(new TypeError())).toBe(true);
      expect(isError({ message: "error" })).toBe(false);
    });
  });

  describe("isFunction", () => {
    it("should correctly identify functions", () => {
      // Regular functions
      expect(isFunction(function () {})).toBe(true);
      expect(isFunction(() => {})).toBe(true);

      // Built-in functions
      expect(isFunction(Array.isArray)).toBe(true);
      expect(isFunction(Object.prototype.toString)).toBe(true);
      expect(isFunction(setTimeout)).toBe(true);

      // Class constructor
      expect(isFunction(class {})).toBe(true);

      // Non-functions
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction(42)).toBe(false);
      expect(isFunction("string")).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);

      // Function properties
      const obj = { method() {} };
      expect(isFunction(obj.method)).toBe(true);
    });
  });

  describe("isIterable", () => {
    it("should correctly identify iterables", () => {
      expect(isIterable([])).toBe(true);
      expect(isIterable(new Set())).toBe(true);
      expect(isIterable(new Map())).toBe(true);
      expect(isIterable("string")).toBe(true);
      expect(isIterable(new WeakMap())).toBe(false);
      expect(isIterable(new WeakSet())).toBe(false);
      expect(isIterable({})).toBe(false);
      expect(isIterable(null)).toBe(false);
      expect(isIterable(undefined)).toBe(false);
    });
  });

  describe("isMap", () => {
    it("should correctly identify Maps", () => {
      expect(isMap(new Map())).toBe(true);
      expect(isMap(new WeakMap())).toBe(false);
      expect(isMap({})).toBe(false);
    });
  });

  describe("isNonNegativeNumber", () => {
    it("should correctly identify non-negative integers", () => {
      expect(isNonNegativeNumber(0)).toBe(true);
      expect(isNonNegativeNumber(1)).toBe(true);
      expect(isNonNegativeNumber(100)).toBe(true);
      expect(isNonNegativeNumber(-1)).toBe(false);
      expect(isNonNegativeNumber(1.5)).toBe(false);
      expect(isNonNegativeNumber(NaN)).toBe(false);
      expect(isNonNegativeNumber(Infinity)).toBe(false);
      expect(isNonNegativeNumber("0")).toBe(false);
      expect(isNonNegativeNumber(null)).toBe(false);
      expect(isNonNegativeNumber(undefined)).toBe(false);
    });
  });

  describe("isNonNegativeValidNumber", () => {
    it("should correctly identify non-negative valid integers", () => {
      expect(isNonNegativeValidNumber(0)).toBe(true);
      expect(isNonNegativeValidNumber(1)).toBe(true);
      expect(isNonNegativeValidNumber(100)).toBe(true);
      expect(isNonNegativeValidNumber(-1)).toBe(false);
      expect(isNonNegativeValidNumber(1.5)).toBe(false);
      expect(isNonNegativeValidNumber(NaN)).toBe(false);
      expect(isNonNegativeValidNumber(Infinity)).toBe(false);
      expect(isNonNegativeValidNumber("0")).toBe(false);
      expect(isNonNegativeValidNumber(null)).toBe(false);
      expect(isNonNegativeValidNumber(undefined)).toBe(false);
    });
  });

  describe("isNull", () => {
    it("should correctly identify null values", () => {
      expect(isNull(null)).toBe(true);
      expect(isNull(undefined)).toBe(false);
      expect(isNull({})).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull("")).toBe(false);
    });
  });

  describe("isNumber", () => {
    it("should correctly identify numbers", () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(1)).toBe(true);
      expect(isNumber(-1)).toBe(true);
      expect(isNumber(1.5)).toBe(true);
      expect(isNumber(NaN)).toBe(true);
      expect(isNumber(Infinity)).toBe(true);
      expect(isNumber(-Infinity)).toBe(true);
      expect(isNumber("1")).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
    });
  });

  describe("isObject", () => {
    it("should correctly identify objects", () => {
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(true);
      expect(isObject(new Map())).toBe(true);
      expect(isObject(() => {})).toBe(true);
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(42)).toBe(false);
      expect(isObject("string")).toBe(false);
    });
  });

  describe("isPlainObject", () => {
    it("should correctly identify plain objects", () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(new Map())).toBe(false);
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);

      class TestClass {}
      expect(isPlainObject(new TestClass())).toBe(false);
    });
  });

  describe("isPositiveInteger", () => {
    it("should correctly identify positive integers", () => {
      expect(isPositiveInteger(1)).toBe(true);
      expect(isPositiveInteger(100)).toBe(true);
      expect(isPositiveInteger(0)).toBe(false);
      expect(isPositiveInteger(-1)).toBe(false);
      expect(isPositiveInteger(1.5)).toBe(false);
      expect(isPositiveInteger("1")).toBe(false);
      expect(isPositiveInteger(null)).toBe(false);
      expect(isPositiveInteger(undefined)).toBe(false);
    });
  });

  describe("isPromise", () => {
    it("should correctly identify Promises", () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(new Promise(() => {}))).toBe(true);
      expect(isPromise({ then: () => {} })).toBe(false);
    });
  });

  describe("isRegExp", () => {
    it("should correctly identify RegExps", () => {
      expect(isRegExp(/test/)).toBe(true);
      expect(isRegExp(new RegExp("test"))).toBe(true);
      expect(isRegExp("/test/")).toBe(false);
    });
  });

  describe("isSet", () => {
    it("should correctly identify Sets", () => {
      expect(isSet(new Set())).toBe(true);
      expect(isSet(new WeakSet())).toBe(false);
      expect(isSet([])).toBe(false);
    });
  });

  describe("isUndefined", () => {
    it("should correctly identify undefined values", () => {
      expect(isUndefined(undefined)).toBe(true);
      expect(isUndefined(void 0)).toBe(true);
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined("")).toBe(false);
      expect(isUndefined({})).toBe(false);
    });
  });

  describe("isValidNumber", () => {
    it("should correctly identify valid numbers", () => {
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(1)).toBe(true);
      expect(isValidNumber(-1)).toBe(true);
      expect(isValidNumber(1.5)).toBe(true);
      expect(isValidNumber(Number.MAX_VALUE)).toBe(true);
      expect(isValidNumber(NaN)).toBe(false);
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber(-Infinity)).toBe(false);
      expect(isValidNumber("1")).toBe(false);
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
    });
  });

  describe("isWeakMap", () => {
    it("should correctly identify WeakMaps", () => {
      expect(isWeakMap(new WeakMap())).toBe(true);
      expect(isWeakMap(new Map())).toBe(false);
      expect(isWeakMap({})).toBe(false);
    });
  });

  describe("isWeakSet", () => {
    it("should correctly identify WeakSets", () => {
      expect(isWeakSet(new WeakSet())).toBe(true);
      expect(isWeakSet(new Set())).toBe(false);
      expect(isWeakSet([])).toBe(false);
    });
  });
});
