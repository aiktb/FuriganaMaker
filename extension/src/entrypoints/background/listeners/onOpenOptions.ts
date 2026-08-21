import { onMessage } from "@/message";

export const registerOnOpenOptionsMessage = () => {
  onMessage("openOptionsPage", () => {
    browser.runtime.openOptionsPage();
  });
};
