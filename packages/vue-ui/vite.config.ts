import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern",
			},
		},
	},
	plugins: [
		vue(),
		vueJsx(),
		dts({
			entryRoot: "src",
			outDir: "dist",
			include: [
				"src/components/**/*.{ts,tsx,vue}",
				"src/index.ts",
				"src/components/index.ts",
			],
			exclude: [
				"src/examples/**/*",
				"src/App.{tsx,vue}",
				"src/main.ts",
				"src/components/**/__tests__/**/*",
			],
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
			external: ["vue", "vue/jsx-runtime"],
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
