import { defineConfig } from "vite";

export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern",
				javascriptEnabled: true,
			},
		},
	},
	build: {
		sourcemap: true,
		reportCompressedSize: true,
		lib: {
			entry: "src/index.ts",
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			external: ["vue", "react", "react-dom"],
			output: {
				preserveModules: true,
				exports: "named",
			},
		},
	},
});
