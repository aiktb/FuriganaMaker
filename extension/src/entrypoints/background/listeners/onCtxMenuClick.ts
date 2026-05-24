import { ExtEvent } from "@/commons/constants";
import { sendMessage } from "@/commons/message";

export const registerOnCtxMenuClick = () => {
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === ExtEvent.AddFurigana) {
      await sendMessage("addFurigana", undefined, tab!.id!);
    }
  });
};
