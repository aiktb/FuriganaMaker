import { ExtStorage, type SelectorRule } from "@/commons/constants";
import { onMessage } from "webext-bridge/background";

export const registerOnGetSelector = () => {
  onMessage("getSelector", async ({ data }) => {
    const allRules = (await storage.getItem(`local:${ExtStorage.SelectorRules}`)) as SelectorRule[];

    const selector =
      allRules
        .filter((rule) => rule.domain === data.domain && rule.active)
        .map((rule) => rule.selector)
        .join(", ") || "";

    return { selector };
  });
};
