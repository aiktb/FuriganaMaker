import { DisplayMode, ExtEvent, ExtStorage } from "@/commons/constants";
import { sendMessage } from "@/commons/utils";
import type { Command } from "@/wxt.config";

export const registerOnCommand = () => {
  // Please see `wxt.config.ts` for a list of shortcut keys.
  browser.commands.onCommand.addListener(async (command, tab) => {
    const tabId = tab!.id!;

    switch (command as Command) {
      case "addFurigana": {
        await sendMessage(tabId, ExtEvent.AddFurigana);
        break;
      }
      case "toggleAutoMode": {
        const key = `local:${ExtStorage.AutoMode}`;
        const autoMode = await storage.getItem<boolean>(key);
        await storage.setItem(key, !autoMode);
        break;
      }
      case "toggleKanjiFilter": {
        const key = `local:${ExtStorage.KanjiFilter}`;
        const kanjiFilter = await storage.getItem<boolean>(key);
        await storage.setItem(key, !kanjiFilter);
        await sendMessage(tabId, ExtEvent.ToggleKanjiFilter);
        break;
      }
      case "toggleFuriganaDisplay": {
        const key = `local:${ExtStorage.DisplayMode}`;
        const displayMode = await storage.getItem<DisplayMode>(key);
        if (displayMode === DisplayMode.Always) {
          await storage.setItem(key, DisplayMode.Never);
          await sendMessage(tabId, ExtEvent.SwitchDisplayMode);
        } else {
          await storage.setItem(key, DisplayMode.Always);
          await sendMessage(tabId, ExtEvent.SwitchDisplayMode);
        }
        break;
      }
    }
  });
};
