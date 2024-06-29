import { DisplayMode, ExtEvent, ExtStorage } from "@/commons/constants";
import { sendMessage } from "@/commons/utils";
import type { Command } from "@/wxt.config";

export const registerOnCommand = () => {
  // Please see `wxt.config.ts` for a list of shortcut keys.
  browser.commands.onCommand.addListener(async (command, tab) => {
    switch (command as Command) {
      case "addFurigana": {
        await sendMessage(tab!.id!, ExtEvent.AddFurigana);
        break;
      }
      case "toggleAutoMode": {
        const autoMode = (await storage.getItem(`local:${ExtStorage.AutoMode}`)) as boolean;
        await storage.setItem(`local:${ExtStorage.AutoMode}`, !autoMode);
        break;
      }
      case "toggleKanjiFilter": {
        const kanjiFilter = (await storage.getItem(`local:${ExtStorage.KanjiFilter}`)) as boolean;
        await storage.setItem(`local:${ExtStorage.KanjiFilter}`, !kanjiFilter);
        await sendMessage(tab!.id!, ExtEvent.ToggleKanjiFilter);
        break;
      }
      case "toggleFuriganaDisplay": {
        const displayMode = (await storage.getItem(
          `local:${ExtStorage.DisplayMode}`,
        )) as DisplayMode;
        if (displayMode === DisplayMode.Always) {
          await storage.setItem(`local:${ExtStorage.DisplayMode}`, DisplayMode.Never);
          await sendMessage(tab!.id!, ExtEvent.SwitchDisplayMode);
        } else {
          await storage.setItem(`local:${ExtStorage.DisplayMode}`, DisplayMode.Always);
          await sendMessage(tab!.id!, ExtEvent.SwitchDisplayMode);
        }
        break;
      }
    }
  });
};
