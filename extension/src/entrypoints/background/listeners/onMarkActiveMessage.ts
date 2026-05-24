import { type ExtensionMessage, onMessage } from "@/commons/message";

type MarkStyle = {
  fillStyle: string;
  i18nMessage: string;
};

export const registerOnMarkActiveMessage = () => {
  onMessage("markActiveTab", (message) =>
    markTab(message, {
      fillStyle: "aqua",
      i18nMessage: browser.i18n.getMessage("extTitleActivated"),
    }),
  );
  onMessage("markDisabledTab", (message) =>
    markTab(message, {
      fillStyle: "red",
      i18nMessage: browser.i18n.getMessage("extTitleDisabled"),
    }),
  );
};

async function markTab(message: ExtensionMessage, { fillStyle, i18nMessage }: MarkStyle) {
  const tabId = message.sender.tab?.id;
  if (tabId === undefined) {
    return;
  }

  const activeTabTitle = `${browser.runtime.getManifest().name} (${i18nMessage})`;
  browser.action.setTitle({
    title: activeTabTitle,
    tabId,
  });

  const SIZE = 32;
  const iconPath = `/${browser.runtime.getManifest().icons![SIZE]!}`;
  const response = await fetch(iconPath);
  const blob = await response.blob();
  const imageBitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(SIZE, SIZE);
  const context = canvas.getContext("2d")!;
  context.drawImage(imageBitmap, 0, 0);
  context.fillStyle = fillStyle;
  context.beginPath();
  const RADIUS = 5;
  context.arc(SIZE - RADIUS, SIZE - RADIUS, RADIUS, 0, 2 * Math.PI);
  context.fill();
  const imageData = context.getImageData(0, 0, SIZE, SIZE);
  browser.action.setIcon({ imageData, tabId });
}
