import { onMessage } from "@/commons/message";

export const registerOnOpenOptionsMessage = () => {
  onMessage("openOptionsPage", () => {
    browser.runtime.openOptionsPage();
  });
};
