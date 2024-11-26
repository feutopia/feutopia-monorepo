import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "lib"),
    },
  },
  plugins: [
    react(),
    libInjectCss(), // Inject css at the top of chunk file in lib mode
    // Generate d.ts file
    dts({
      tsconfigPath: "./tsconfig.json",
      exclude: ["lib/**/__tests__/"],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  build: {
    lib: {
      entry: "./lib/main.ts",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      input: Object.fromEntries(
        // https://rollupjs.org/configuration-options/#input
        glob
          .sync("lib/**/*.{ts,tsx}", {
            ignore: ["lib/**/*.test.ts", "lib/**/*.d.ts"],
          })
          .map((file) => [
            // e.g. lib/nested/foo.js becomes nested/foo
            path.relative(
              "lib",
              file.slice(0, file.length - path.extname(file).length)
            ),
            // e.g. lib/nested/foo becomes /project/lib/nested/foo.js
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "chunks/[name].[hash].js",
        entryFileNames: "[name].js",
      },
    },
    // 添加这个配置来禁止复制 public 目录
    copyPublicDir: false,
  },
});
