import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
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
  manifest: {
    version: "2.0.0",
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    permissions: ["contextMenus", "storage"],
    default_locale: "en",
    icons: {
      "16": "icons/16.png",
      "32": "icons/32.png",
      "48": "icons/48.png",
      "128": "icons/128.png",
    },
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
});
