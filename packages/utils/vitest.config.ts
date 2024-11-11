import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		typecheck: {
			enabled: true, // 启用类型检查
			tsconfig: "./tsconfig.json",
		},
	},
});
