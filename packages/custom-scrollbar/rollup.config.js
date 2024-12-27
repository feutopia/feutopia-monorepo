import { defineConfig } from "rollup";
import del from "rollup-plugin-delete";
import sass from "rollup-plugin-sass";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";

export default defineConfig([
  {
    input: "lib/main.ts", // 入口文件
    output: [
      {
        file: `dist/esm/CustomScrollbar.js`,
        format: "esm",
      },
      {
        file: `dist/cjs/CustomScrollbar.js`,
        format: "cjs",
      },
      {
        file: `dist/umd/CustomScrollbar.js`,
        format: "umd",
        name: "CustomScrollbar",
      },
    ],
    /*
    nodeResolve 插件为了让导入组件可以简写成:
      import { debounce } from "./utils"
    而不需要写成:
      import { debounce } from "./utils/index"
  */
    // https://github.com/vitejs/vite/blob/9290d85b5d2ad64991bd296157cb3bcb959c341d/packages/vite/rollup.config.ts
    plugins: [
      del({ targets: "dist/*" }),
      sass({
        options: {
          silenceDeprecations: ["legacy-js-api"],
        },
        output: true,
      }),
      typescript(),
      commonjs({
        sourceMap: false,
        strictRequires: "auto",
      }),
      nodeResolve(),
      babel({
        babelHelpers: "bundled",
      }),
    ],
  },
  // 生成 .d.ts 声明文件的配置
  {
    input: "lib/main.ts",
    output: {
      file: "dist/types/index.d.ts", // 声明文件输出
      format: "esm", // ESM 格式
    },
    plugins: [
      sass({
        options: {
          silenceDeprecations: ["legacy-js-api"],
        },
      }),
      dts(),
    ], // 使用 rollup-plugin-dts 插件生成声明文件
  },
]);
