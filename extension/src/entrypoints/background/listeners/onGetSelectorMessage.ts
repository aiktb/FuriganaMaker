import picomatch from "picomatch/posix";
import { onMessage } from "@/messaging/message";
import { customSelectors } from "@/storage/settings";

export const registerOnGetSelector = () => {
  onMessage("getSelector", async ({ data }) => {
    const allRules = await customSelectors.getValue();

    const selector =
      allRules
        .filter((rule) => {
          const isMatch = picomatch(rule.domain, { nocase: true });
          return rule.active && isMatch(data.domain);
        })
        .map((rule) => rule.selector)
        .join(", ") || "";

    return { selector };
  });
};
