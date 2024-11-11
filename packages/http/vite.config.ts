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
			outDir: ["dist/esm", "dist/cjs"],
			include: ["src/index.ts", "src/**/*.ts"],
			exclude: ["src/**/__tests__/**/*"],
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
				const directory = format === "es" ? "esm" : "cjs";
				return `${directory}/${entryName}.js`;
			},
		},
		rollupOptions: {
			output: {
				preserveModules: false, // 改为 false，不保留模块结构
				exports: "named",
			},
		},
		// 添加这个配置来禁止复制 public 目录
		copyPublicDir: false,
	},
});
