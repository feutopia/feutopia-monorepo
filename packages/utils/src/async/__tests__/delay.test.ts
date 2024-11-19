import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { delay, cancelDelay } from "../delay";

describe("delay utility", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should resolve after specified delay", async () => {
    const promise = delay(100);
    vi.advanceTimersByTime(100);
    const result = await promise;
    expect(result).toEqual({ cancelled: false });
  });

  it("should resolve immediately when delay is 0", async () => {
    const result = await delay(0);
    expect(result).toEqual({ cancelled: false });
  });

  it("should throw error for invalid delay values", () => {
    expect(() => delay(-1)).toThrow(
      "Delay time must be a non-negative finite number"
    );
    expect(() => delay(Infinity)).toThrow(
      "Delay time must be a non-negative finite number"
    );
    expect(() => delay(NaN)).toThrow(
      "Delay time must be a non-negative finite number"
    );
  });

  it("should cancel delay and resolve with cancelled status", async () => {
    const promise = delay(100);
    cancelDelay(promise);
    const result = await promise;
    expect(result).toEqual({ cancelled: true });
  });

  it("should clean up internal references after resolution", async () => {
    const promise = delay(100);
    vi.advanceTimersByTime(100);
    await promise;
    // Try to cancel after resolution (should have no effect)
    cancelDelay(promise);
    expect(await promise).toEqual({ cancelled: false });
  });

  it("should execute callback after specified delay", async () => {
    const callback = vi.fn();
    const promise = delay(100, callback);

    expect(callback).not.toBeCalled();
    vi.advanceTimersByTime(100);
    await promise;

    expect(callback).toBeCalledTimes(1);
  });

  it("should not execute callback when delay is cancelled", async () => {
    const callback = vi.fn();
    const promise = delay(100, callback);

    cancelDelay(promise);
    await promise;
    vi.advanceTimersByTime(100);

    expect(callback).not.toBeCalled();
  });

  it("should execute callback immediately when delay is 0", async () => {
    const callback = vi.fn();
    await delay(0, callback);

    expect(callback).toBeCalledTimes(1);
  });
});
