import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import baseConfig from "../../vite.config";

export default defineConfig({
	...baseConfig,
	plugins: [react()],
	build: {
		...baseConfig.build,
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "FeutopiaReactUI",
		},
		rollupOptions: {
			...baseConfig.build?.rollupOptions,
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
	},
} as UserConfig);
