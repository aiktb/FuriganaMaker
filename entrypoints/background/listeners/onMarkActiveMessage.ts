import type { Action } from "wxt/browser";

import { ExtEvent } from "@/commons/constants";

export const registerOnMarkActiveMessage = () => {
  chrome.runtime.onMessage.addListener(async (event, sender) => {
    if (event === ExtEvent.MarkActiveTab) {
      const activeTabTitle = `${chrome.runtime.getManifest().name} (${chrome.i18n.getMessage("markActive")})`;
      chrome.action.setTitle({
        title: activeTabTitle,
        tabId: sender.tab!.id!,
      });

      const SIZE = 32;
      const iconPath = `/${chrome.runtime.getManifest().icons![SIZE]!}`;

      fetch(iconPath)
        .then((response) => response.blob())
        .then((blob) => createImageBitmap(blob))
        .then((imageBitmap) => {
          const canvas = new OffscreenCanvas(SIZE, SIZE);
          const context = canvas.getContext("2d")!;
          context.drawImage(imageBitmap, 0, 0);
          context.fillStyle = "aqua";
          context.beginPath();
          const RADIUS = 5;
          context.arc(SIZE - RADIUS, SIZE - RADIUS, RADIUS, 0, 2 * Math.PI);
          context.fill();
          const imageData = context.getImageData(0, 0, SIZE, SIZE) as Action.ImageDataType;
          chrome.action.setIcon({ imageData, tabId: sender.tab!.id! });
        });
    }
  });
};
