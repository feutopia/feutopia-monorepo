import type { Plugin } from "vite";
import path from "path";
import fs from "fs";

export function generateRootIndex(): Plugin {
  return {
    name: "vite-plugin-generate-root-index",
    closeBundle() {
      const templatePath = path.resolve(__dirname, "./index.template.js");
      const content = fs.readFileSync(templatePath, "utf-8");
      const filePath = path.resolve(process.cwd(), "dist", "index.js");
      fs.writeFileSync(filePath, content);
    },
  };
}
