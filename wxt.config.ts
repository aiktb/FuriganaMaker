import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "wxt";

import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

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
  vite: () => ({
    plugins: [svgr()],
    css: {
      postcss: {
        plugins: [tailwind, autoprefixer],
      },
    },
    build: {
      // Default target not support dynamic import.
      target: "ESNext",
    },
  }),
  hooks: {
    "build:done": ({ config, logger }) => {
      const srcDir = "./node_modules/@sglkc/kuromoji/dict";
      const filenames = readdirSync(srcDir);
      const destDir = resolve(config.outDir, "dict");
      mkdirSync(destDir);
      for (const filename of filenames) {
        const src = resolve(srcDir, filename);
        const dest = resolve(destDir, filename);
        copyFileSync(src, dest);
        logger.info(`Copied ${filename} to ${destDir}`);
      }
    },
  },
});
