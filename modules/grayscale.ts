import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { defineWxtModule } from "wxt/modules";

export default defineWxtModule((wxt) => {
  if (wxt.config.mode === "development") {
    wxt.hooks.hook("build:done", async (wxt, output) => {
      const iconPaths = output.publicAssets
        .map((asset) => asset.fileName)
        .filter((fileName) => fileName.startsWith("icons"));

      for (const iconPath of iconPaths) {
        const absoluteIconPath = path.resolve(wxt.config.outDir, iconPath);
        const icon = fs.readFileSync(absoluteIconPath);
        const iconBuffer = await sharp(icon).grayscale().toBuffer();
        fs.writeFileSync(absoluteIconPath, iconBuffer);
      }
    });
  }
});
