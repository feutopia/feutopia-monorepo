import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      entryRoot: "src",
      outDir: "dist/types",
      include: ["src/index.ts", "src/**/*.ts"],
      insertTypesEntry: true, // 根据package.json中的types字段生成 types 文件
      rollupTypes: true, // 是否将所有的类型声明打包到一个文件中
    }),
  ],
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
      },
      name: "FeutopiaVueHooks",
      formats: ["es", "cjs", "umd"],
      fileName: (format, entryName) => {
        const formatDirectoryMap = {
          es: "esm",
          cjs: "cjs",
          umd: "umd",
        };
        const directory =
          formatDirectoryMap[format as keyof typeof formatDirectoryMap];
        return `${directory}/${entryName}.js`;
      },
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        exports: "named", // 使用命名导出的方式，而不是默认导出
      },
    },
    // 添加这个配置来禁止复制 public 目录
    copyPublicDir: false,
  },
});
