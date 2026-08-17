import { onMessage } from "@/messaging/message";

export const registerOnOpenOptionsMessage = () => {
  onMessage("openOptionsPage", () => {
    browser.runtime.openOptionsPage();
  });
};
