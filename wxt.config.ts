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
    version: "2.0.2",
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    permissions: ["contextMenus", "storage"],
    default_locale: "en",
    commands,
  },
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  autoIcons: {
    baseIconPath: "assets/icons/icon.svg",
  },
  imports: {
    presets: ["react", "react-router-dom"],
  },
  vite: () => ({
    plugins: [svgr()],
  }),
});
