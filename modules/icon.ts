import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { defineWxtModule } from "wxt/modules";

export default defineWxtModule((wxt) => {
  wxt.hooks.hook("build:done", () => {
    const sizes = [16, 32, 48, 128];
    const destDir = path.resolve(wxt.config.outDir, "icons");
    fs.mkdirSync(destDir);
    const logo = sharp(path.resolve(__dirname, "../assets/icons/Logo.svg"));
    for (const size of sizes) {
      const destFile = path.resolve(destDir, `${size}.png`);
      const png = logo.resize(size, size).png();
      if (wxt.config.mode === "development") {
        png.grayscale().toFile(destFile);
      } else {
        png.toFile(destFile);
      }
    }
  });
});
