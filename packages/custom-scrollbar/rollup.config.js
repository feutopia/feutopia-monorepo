import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import sass from "rollup-plugin-sass";
import del from "rollup-plugin-delete";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
  input: "lib/main.js",
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
    sass({ output: true }),
    commonjs({
      sourceMap: false,
      strictRequires: "auto",
    }),
    nodeResolve(),
    babel({
      babelHelpers: "bundled",
    }),
  ],
});
