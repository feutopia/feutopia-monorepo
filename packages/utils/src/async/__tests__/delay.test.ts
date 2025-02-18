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
    expect(promise.isRunning).toBe(true);

    vi.advanceTimersByTime(100);
    const result = await promise;

    expect(result).toEqual({ cancelled: false });
    expect(promise.isRunning).toBe(false);
  });

  it("should throw error for invalid delay values", () => {
    expect(() => delay(-1)).toThrow();
    expect(() => delay(Infinity)).toThrow();
    expect(() => delay(NaN)).toThrow();
  });

  it("should cancel delay and resolve with cancelled status", async () => {
    const promise = delay(100);
    expect(promise.isRunning).toBe(true);

    cancelDelay(promise);
    expect(promise.isRunning).toBe(false);

    const result = await promise;
    expect(result).toEqual({ cancelled: true });
    expect(promise.isRunning).toBe(false);
  });

  it("should clean up internal references after resolution", async () => {
    const promise = delay(100);
    expect(promise.isRunning).toBe(true);

    vi.advanceTimersByTime(100);
    await promise;

    expect(promise.isRunning).toBe(false);

    // Try to cancel after resolution (should have no effect)
    cancelDelay(promise);
    expect(promise.isRunning).toBe(false);
  });

  it("should execute callback after specified delay", async () => {
    const callback = vi.fn();
    const promise = delay(100, callback);
    expect(promise.isRunning).toBe(true);

    expect(callback).not.toBeCalled();
    vi.advanceTimersByTime(100);
    await promise;

    expect(callback).toBeCalledTimes(1);
    expect(promise.isRunning).toBe(false);
  });

  it("should not execute callback when delay is cancelled", async () => {
    const callback = vi.fn();
    const promise = delay(100, callback);
    expect(promise.isRunning).toBe(true);

    cancelDelay(promise);
    expect(promise.isRunning).toBe(false);

    await promise;
    vi.advanceTimersByTime(100);

    expect(callback).not.toBeCalled();
    expect(promise.isRunning).toBe(false);
  });
});
