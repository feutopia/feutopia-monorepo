import { describe, it, expect } from "vitest";
import { truncate } from "../truncate";

describe("truncate", () => {
	it("should truncate text that exceeds max length", () => {
		const text = "This is a long text that needs to be truncated";
		expect(truncate(text, 20)).toBe("This is a long text...");
	});

	it("should not truncate text shorter than max length", () => {
		const text = "Short text";
		expect(truncate(text, 20)).toBe("Short text");
	});

	it("should handle custom suffix", () => {
		const text = "This is a long text that needs to be truncated";
		expect(truncate(text, 20, "---")).toBe("This is a long text---");
	});

	it("should handle empty string", () => {
		expect(truncate("", 20)).toBe("");
	});

	it("should handle text equal to max length", () => {
		const text = "Exactly twenty chars";
		expect(truncate(text, 20)).toBe("Exactly twenty chars");
	});

	it("should handle very short max length", () => {
		const text = "Some text";
		expect(truncate(text, 3)).toBe("Som...");
	});

	it("should handle max length shorter than suffix", () => {
		const text = "Some text";
		expect(truncate(text, 2, "...")).toBe("...");
	});

	it("should handle undefined input", () => {
		expect(truncate(undefined, 20)).toBe("");
	});

	it("should handle non-string input", () => {
		expect(truncate(123 as any, 20)).toBe("123");
		expect(truncate(null as any, 20)).toBe("");
	});
});
