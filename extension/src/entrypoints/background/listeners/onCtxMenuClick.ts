import { sendMessage } from "@/message";

export const CONTEXT_MENU_ID = "addFurigana";

export const registerOnCtxMenuClick = () => {
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === CONTEXT_MENU_ID) {
      await sendMessage("addFurigana", undefined, tab!.id!);
    }
  });
};
