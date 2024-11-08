import { describe, it, expect } from "vitest";
import { filterNonNilValues } from "../filterNonNilValues";

describe("filterNonNilValues", () => {
	it("should filter out null and undefined values", () => {
		const input = {
			a: 1,
			b: null,
			c: undefined,
			d: "test",
			e: 0,
			f: false,
			g: "",
		};

		const result = filterNonNilValues(input);
		expect(result).toEqual({
			a: 1,
			d: "test",
			e: 0,
			f: false,
			g: "",
		});
	});

	it("should handle empty object", () => {
		const input = {};
		const result = filterNonNilValues(input);
		expect(result).toEqual({});
	});

	it("should handle object with all nil values", () => {
		const input = {
			a: null,
			b: undefined,
		};
		const result = filterNonNilValues(input);
		expect(result).toEqual({});
	});

	it("should handle nested objects", () => {
		const input = {
			a: {
				b: 1,
				c: null,
			},
			d: null,
			e: { f: undefined },
		};
		const result = filterNonNilValues(input);
		expect(result).toEqual({
			a: {
				b: 1,
				c: null,
			},
			e: { f: undefined },
		});
	});

	it("should handle arrays", () => {
		const input = {
			a: [1, null, 3],
			b: null,
			c: [],
		};
		const result = filterNonNilValues(input);
		expect(result).toEqual({
			a: [1, null, 3],
			c: [],
		});
	});

	it("should handle falsy values correctly", () => {
		const input = {
			a: 0,
			b: "",
			c: false,
			d: null,
			e: undefined,
		};
		const result = filterNonNilValues(input);
		expect(result).toEqual({
			a: 0,
			b: "",
			c: false,
		});
	});

	it("should handle undefined input", () => {
		const result = filterNonNilValues(undefined as any);
		expect(result).toEqual({});
	});

	it("should handle null input", () => {
		const result = filterNonNilValues(null as any);
		expect(result).toEqual({});
	});

	it("should preserve Date objects", () => {
		const date = new Date();
		const input = {
			a: date,
			b: null,
		};
		const result = filterNonNilValues(input);
		expect(result).toEqual({
			a: date,
		});
	});

	it("should preserve complex objects", () => {
		const complex = {
			nested: {
				array: [1, 2, 3],
				date: new Date(),
				map: new Map(),
				set: new Set(),
			},
		};
		const input = {
			a: complex,
			b: null,
		};
		const result = filterNonNilValues(input);
		expect(result).toEqual({
			a: complex,
		});
	});
});
