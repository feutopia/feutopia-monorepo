import { describe, it, expect } from "vitest";
import { formatThousands } from "../formatThousands";

describe("formatThousands", () => {
	it("should format numbers with thousand separators", () => {
		expect(formatThousands(1234567)).toBe("1,234,567");
		expect(formatThousands(1000)).toBe("1,000");
		expect(formatThousands(999)).toBe("999");
	});

	it("should handle decimal numbers", () => {
		expect(formatThousands(1234567.89)).toBe("1,234,567.89");
		expect(formatThousands(1000.123)).toBe("1,000.123");
		expect(formatThousands(999.9)).toBe("999.9");
	});

	it("should handle negative numbers", () => {
		expect(formatThousands(-1234567)).toBe("-1,234,567");
		expect(formatThousands(-1000.123)).toBe("-1,000.123");
	});

	it("should handle edge cases", () => {
		expect(formatThousands(0)).toBe("0");
		expect(formatThousands(-0)).toBe("0");
		expect(formatThousands(NaN)).toBe("NaN");
	});

	it("should handle string numbers", () => {
		expect(formatThousands("1234567")).toBe("1,234,567");
		expect(formatThousands("1000.123")).toBe("1,000.123");
	});
});
