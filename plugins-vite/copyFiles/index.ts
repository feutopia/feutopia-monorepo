import type { Plugin } from "vite";
import path from "path";
import fs from "fs";

interface CopyPluginOptions {
  files: string[];
}

export function copyFiles(options: CopyPluginOptions = { files: [] }): Plugin {
  return {
    name: "vite-plugin-copy-files",
    closeBundle: () => {
      const filesToCopy =
        options.files.length > 0
          ? options.files
          : ["README.md", "README.zh-CN.md"]; // 默认值
      const publicDir = path.resolve(process.cwd(), "./");
      const distDir = path.resolve(process.cwd(), "./dist");
      for (const file of filesToCopy) {
        try {
          fs.copyFileSync(
            path.resolve(publicDir, file),
            path.resolve(distDir, file)
          );
          console.log(`Copied: ${file}`);
        } catch (error) {
          console.warn(`Failed to copy ${file}: ${error.message}`);
        }
      }
    },
  };
}
