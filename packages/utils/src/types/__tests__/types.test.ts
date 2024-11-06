import { describe, it, expect } from "vitest";
import type { IsNullable, RequireNonNull, NonNullableProps } from "../index";

describe("Type Utils", () => {
	it("IsNullable type check", () => {
		type Test1 = IsNullable<string | null>; // true
		type Test2 = IsNullable<string>; // false

		// 使用类型断言进行测试
		const test1: Test1 = true as const;
		const test2: Test2 = false as const;

		expect(test1).toBe(true);
		expect(test2).toBe(false);
	});

	it("RequireNonNull type check", () => {
		type Test1 = RequireNonNull<string>; // string

		// 编译时类型检查，无需运行时断言
		const value: Test1 = "test";
		expect(typeof value).toBe("string");
	});

	it("NonNullableProps type check", () => {
		interface TestInterface {
			required: string;
			optional?: string;
			nullable: string | null;
		}

		type CleanInterface = NonNullableProps<TestInterface>;

		// 创建一个符合 CleanInterface 的对象
		const obj: CleanInterface = {
			required: "test",
		};

		expect(obj).toHaveProperty("required");
		expect(obj).not.toHaveProperty("optional");
		expect(obj).not.toHaveProperty("nullable");
	});
});
