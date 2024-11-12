import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	plugins: [
		dts({
			entryRoot: "src",
			outDir: "dist",
			include: ["src/index.ts", "src/**/*.ts"],
			exclude: ["src/**/__tests__/**/*"],
			// 添加这个配置以确保生成根级别的类型文件
			rollupTypes: true,
		}),
	],
	build: {
		lib: {
			entry: {
				index: resolve(__dirname, "src/index.ts"),
			},
			formats: ["es", "cjs"],
			fileName: (format, entryName) => {
				const extension = format === "es" ? "mjs" : "cjs";
				return `${entryName}.${extension}`;
			},
		},
		rollupOptions: {
			output: {
				preserveModules: true,
				preserveModulesRoot: "src",
				exports: "named",
			},
		},
		// 添加这个配置来禁止复制 public 目录
		copyPublicDir: false,
	},
});
