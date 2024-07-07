import { ExtStorage, type SelectorRule } from "@/commons/constants";
import { onMessage } from "@/commons/message";

export const registerOnGetSelector = () => {
  onMessage("getSelector", async ({ data }) => {
    const allRules = await storage.getItem<SelectorRule[]>(`local:${ExtStorage.SelectorRules}`);

    const selector =
      allRules
        ?.filter((rule) => rule.domain === data.domain && rule.active)
        .map((rule) => rule.selector)
        .join(", ") || "";

    return { selector };
  });
};
