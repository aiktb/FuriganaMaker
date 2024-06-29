import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "wxt";

import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const commands = {
  addFurigana: {
    description: "Add furigana on the current page",
  },
  toggleAutoMode: {
    description: "Toggle auto mode on all pages",
  },
  toggleKanjiFilter: {
    description: "Toggle kanji filter on all pages",
  },
  toggleFuriganaDisplay: {
    description: "Toggle furigana display mode on all pages",
  },
} as const;

export type Command = keyof typeof commands;

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    version: "1.6.1",
    name: "Furigana Maker",
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
