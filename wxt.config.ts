import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "wxt";

import fs from "node:fs";
import path from "node:path";

const commands = {
  addFurigana: {
    description: "__MSG_shortcutAddFurigana__",
  },
  toggleAutoMode: {
    description: "__MSG_shortcutToggleAutoMode__",
  },
  toggleKanjiFilter: {
    description: "__MSG_shortcutToggleKanjiFilter__",
  },
  toggleFuriganaDisplay: {
    description: "__MSG_shortcutToggleFuriganaDisplay__",
  },
};

export type Command = keyof typeof commands;

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    version: "1.6.1",
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    permissions: ["contextMenus", "storage"],
    default_locale: "en",
    commands,
  },
  modules: ["@wxt-dev/module-react"],
  imports: {
    presets: ["react", "react-router-dom"],
  },
  vite: () => ({
    plugins: [svgr()],
    css: {
      postcss: {
        plugins: [tailwind, autoprefixer],
      },
    },
  }),
  hooks: {
    "build:done": ({ config, logger }) => {
      const srcDir = "./node_modules/@sglkc/kuromoji/dict";
      const filenames = fs.readdirSync(srcDir);
      const destDir = path.resolve(config.outDir, "dict");
      fs.mkdirSync(destDir);
      for (const filename of filenames) {
        const src = path.resolve(srcDir, filename);
        const dest = path.resolve(destDir, filename);
        fs.copyFileSync(src, dest);
        logger.info(`Copied ${filename} to build target`);
      }
    },
  },
});
