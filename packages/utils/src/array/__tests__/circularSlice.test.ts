import { describe, it, expect } from "vitest";
import { circularSlice } from "../circularSlice";

describe("circularSlice", () => {
  it("should return empty array when input array is empty", () => {
    expect(circularSlice([], 0, 5)).toEqual([]);
  });

  it("should slice array circularly from specified position", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(circularSlice(arr, 0, 3)).toEqual([1, 2, 3]);
    expect(circularSlice(arr, 3, 3)).toEqual([4, 5, 1]);
    expect(circularSlice(arr, 4, 3)).toEqual([5, 1, 2]);
  });

  it("should handle count greater than array length", () => {
    const arr = [1, 2, 3];
    expect(circularSlice(arr, 0, 5)).toEqual([1, 2, 3, 1, 2]);
    expect(circularSlice(arr, 1, 4)).toEqual([2, 3, 1, 2]);
  });

  it("should handle negative start index", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(circularSlice(arr, -1, 3)).toEqual([5, 1, 2]);
    expect(circularSlice(arr, -11, 3)).toEqual([5, 1, 2]);
    expect(circularSlice(arr, -2, 4)).toEqual([4, 5, 1, 2]);
    expect(circularSlice(arr, -12, 4)).toEqual([4, 5, 1, 2]);
  });
});
