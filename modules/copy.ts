import fs from "node:fs";
import path from "node:path";
import { defineWxtModule } from "wxt/modules";

export default defineWxtModule((wxt) => {
  wxt.hooks.hook("build:done", ({ config }) => {
    const srcDir = path.resolve(__dirname, "../node_modules/@sglkc/kuromoji/dict");
    const filenames = fs.readdirSync(srcDir);
    const destDir = path.resolve(config.outDir, "dict");
    fs.mkdirSync(destDir);
    for (const filename of filenames) {
      const src = path.resolve(srcDir, filename);
      const dest = path.resolve(destDir, filename);
      fs.copyFileSync(src, dest);
    }
  });
});
