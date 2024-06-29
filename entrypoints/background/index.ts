import { registerOnCommand } from "./listeners/onCommand";
import { registerOnCtxMenuClick } from "./listeners/onCtxMenuClick";
import { registerOnGetKanjiMarksMessage } from "./listeners/onGetKanjiMarksMessage";
import { registerOnGetSelector } from "./listeners/onGetSelectorMessage";
import { registerOnInstalled } from "./listeners/onInstalled";
import { registerOnMarkActiveMessage } from "./listeners/onMarkActiveMessage";
export default defineBackground({
  type: "module",
  main() {
    registerOnInstalled();
    registerOnCommand();
    registerOnCtxMenuClick();

    // chrome.runtime.onMessage.addListener(...)
    registerOnMarkActiveMessage();
    registerOnGetKanjiMarksMessage();
    registerOnGetSelector();
  },
});
