import { defineConfig } from "rollup";
import del from "rollup-plugin-delete";
import sass from "rollup-plugin-sass";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import strip from "@rollup/plugin-strip";
import dts from "rollup-plugin-dts";
import { DEFAULT_EXTENSIONS } from "@babel/core";

const sassOptions = {
  options: {
    silenceDeprecations: ["legacy-js-api"],
  },
};

const input = "lib/main.ts";

export default defineConfig([
  {
    input, // 入口文件
    output: [
      {
        file: `dist/esm/index.js`,
        format: "esm",
      },
      {
        file: `dist/cjs/index.js`,
        format: "cjs",
      },
      {
        file: `dist/umd/index.js`,
        format: "umd",
        name: "CustomScrollbar",
      },
    ],
    plugins: [
      // 清理 dist 文件夹
      del({ targets: "dist/*" }),
      // 处理 SASS 样式
      sass({
        ...sassOptions,
        output: true,
      }),
      // 去除开发调试时的代码 (如console.log)
      strip({
        include: "**/*.(js|ts)",
      }),
      // 解析模块依赖（支持 node_modules）
      nodeResolve(),
      // 编译 TypeScript 文件，生成 JavaScript 输出
      typescript(),
      // 转换 CommonJS 模块为 ES6 模块
      commonjs({
        sourceMap: false,
        strictRequires: "auto",
        extensions: [".js", ".ts"],
      }),
      // 	使用 Babel 编译文件
      babel({
        babelHelpers: "bundled",
        extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
      }),
    ],
  },
  // 生成 index.d.ts 声明文件的配置
  {
    input,
    output: {
      file: "dist/types/index.d.ts",
      format: "esm",
    },
    plugins: [sass({ ...sassOptions }), dts()],
  },
]);
