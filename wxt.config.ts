import fs from "node:fs";
import path from "node:path";

import svgr from "vite-plugin-svgr";
import { defineConfig } from "wxt";

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
  extensionApi: "chrome",
  manifest: {
    version: "2.1.4",
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    permissions: ["contextMenus", "storage"],
    default_locale: "en",
    commands,
  },
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  autoIcons: {
    baseIconPath: "assets/icons/Logo.svg",
  },
  imports: {
    presets: ["react", "react-router-dom"],
  },
  vite: () => ({
    plugins: [svgr()],
    build: {
      target: "esnext",
    },
  }),
  hooks: {
    "build:publicAssets": ({ config }, publicFiles) => {
      const srcDir = path.resolve(__dirname, "./node_modules/@sglkc/kuromoji/dict");
      const filenames = fs.readdirSync(srcDir);
      const destDir = path.resolve(config.outDir, "dict");
      fs.mkdirSync(destDir);
      for (const filename of filenames) {
        const absoluteSrc = path.resolve(srcDir, filename);
        const relativeDest = path.resolve(destDir, filename);
        publicFiles.push({ absoluteSrc, relativeDest });
      }
    },
  },
});
