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

const isProduction = process.env.NODE_ENV === "production";

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
      // 1. 删除输出文件夹
      isProduction && del({ targets: "dist/*" }),
      // 2. 编译 SASS 文件
      sass({
        ...sassOptions,
        output: true,
      }),
      // 3. 解析模块路径和 node_modules
      nodeResolve(),
      // 4. 转换 TypeScript 文件
      typescript(),
      // 5. 转换 CommonJS 模块
      commonjs({
        sourceMap: false,
        strictRequires: "auto",
        extensions: [".js", ".ts"],
      }),
      // 6. 使用 Babel 进一步编译
      babel({
        babelHelpers: "bundled",
        extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
      }),
      // 7. 去除调试代码 (如console.log)
      isProduction &&
        strip({
          include: "**/*.(js|ts)",
        }),
    ],
  },
  // 生成 index.d.ts 声明文件的配置
  isProduction && {
    input,
    output: {
      file: "dist/types/index.d.ts",
      format: "esm",
    },
    plugins: [sass({ ...sassOptions }), dts()],
  },
]);
