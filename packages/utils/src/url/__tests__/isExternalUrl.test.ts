import { describe, it, expect } from "vitest";
import { isExternalUrl } from "../isExternalUrl";

describe("isExternalUrl", () => {
	it("should identify external URLs", () => {
		expect(isExternalUrl("https://example.com")).toBe(true);
		expect(isExternalUrl("http://external-site.org")).toBe(true);
		expect(isExternalUrl("//cdn.example.com")).toBe(true);
	});

	it("should identify internal URLs", () => {
		expect(isExternalUrl("/path/to/page")).toBe(false);
		expect(isExternalUrl("./relative/path")).toBe(false);
		expect(isExternalUrl("../parent/path")).toBe(false);
		expect(isExternalUrl("path/without/slash")).toBe(false);
	});

	it("should handle empty or invalid inputs", () => {
		expect(isExternalUrl("")).toBe(false);
		expect(isExternalUrl(" ")).toBe(false);
		expect(isExternalUrl("#anchor")).toBe(false);
	});
});
