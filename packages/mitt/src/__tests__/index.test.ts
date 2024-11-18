import { describe, it, expect, beforeEach, vi } from "vitest";
import mitt from "../index";

describe("mitt", () => {
  type Events = {
    foo: string;
    bar: number;
    baz: undefined;
  };

  let emitter: ReturnType<typeof mitt<Events>>;

  beforeEach(() => {
    emitter = mitt<Events>();
  });

  describe("on()", () => {
    it("should register event handler", () => {
      const handler = vi.fn();
      emitter.on("foo", handler);

      emitter.emit("foo", "test");
      expect(handler).toHaveBeenCalledWith("test");
    });

    it("should support wildcard handlers", () => {
      const handler = vi.fn();
      emitter.on("*", handler);

      emitter.emit("foo", "test");
      expect(handler).toHaveBeenCalledWith("foo", "test");
    });

    it("should return off function", () => {
      const handler = vi.fn();
      const off = emitter.on("foo", handler);

      off();
      emitter.emit("foo", "test");
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe("once()", () => {
    it("should only trigger handler once", () => {
      const handler = vi.fn();
      emitter.once("foo", handler);

      emitter.emit("foo", "test1");
      emitter.emit("foo", "test2");

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith("test1");
    });
  });

  describe("off()", () => {
    it("should remove specific handler", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      emitter.on("foo", handler1);
      emitter.on("foo", handler2);

      emitter.off("foo", handler1);
      emitter.emit("foo", "test");

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledWith("test");
    });

    it("should remove all handlers when handler is omitted", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      emitter.on("foo", handler1);
      emitter.on("foo", handler2);

      emitter.off("foo");
      emitter.emit("foo", "test");

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe("emit()", () => {
    it("should emit to multiple handlers", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      emitter.on("foo", handler1);
      emitter.on("foo", handler2);

      emitter.emit("foo", "test");

      expect(handler1).toHaveBeenCalledWith("test");
      expect(handler2).toHaveBeenCalledWith("test");
    });

    it("should support events without payload", () => {
      const handler = vi.fn();
      emitter.on("baz", handler);

      emitter.emit("baz");

      expect(handler).toHaveBeenCalledWith(undefined);
    });
  });

  describe("clear()", () => {
    it("should remove all handlers", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      emitter.on("foo", handler1);
      emitter.on("bar", handler2);

      emitter.clear();

      emitter.emit("foo", "test");
      emitter.emit("bar", 123);

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });
});
