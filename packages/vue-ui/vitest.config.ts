import { defineConfig, mergeConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import baseConfig from "../../vitest.config";
import { resolve } from "path";

export default defineConfig(
	mergeConfig(baseConfig, {
		plugins: [vue(), vueJsx()],
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src"),
			},
		},
		test: {
			...baseConfig.test,
			environment: "happy-dom",
		},
	})
);
