import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	test: {
		environment: "node",
		globals: true,
		typecheck: {
			enabled: true, // 启用类型检查
			tsconfig: "./tsconfig.json",
		},
	},
});
