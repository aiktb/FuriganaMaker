import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { defineWxtModule } from "wxt/modules";

export default defineWxtModule((wxt) => {
  const sizes = [16, 32, 48, 128];
  const destDir = path.resolve(wxt.config.outDir, "icons");

  wxt.hooks.hook("build:publicAssets", () => {
    fs.mkdirSync(destDir);
    const logoInstance = sharp(path.resolve(__dirname, "../assets/icons/Logo.svg"));
    for (const size of sizes) {
      const destFile = path.resolve(destDir, `${size}.png`);
      logoInstance.resize(size, size).png().toFile(destFile);
    }
  });

  if (wxt.config.mode === "development") {
    wxt.hooks.hook("build:done", async () => {
      const iconPaths = sizes.map((size) => path.resolve(destDir, `${size}.png`));

      for (const iconPath of iconPaths) {
        const icon = fs.readFileSync(iconPath);
        const iconBuffer = await sharp(icon).grayscale().toBuffer();
        fs.writeFileSync(iconPath, iconBuffer);
      }
    });
  }
});
