import { ExtEvent, ExtStorage, type StorageChangeEvent } from "./constants";

export const toStorageKey = (event: StorageChangeEvent) => {
  switch (event) {
    case ExtEvent.ToggleKanjiFilter:
      return ExtStorage.KanjiFilter;
    case ExtEvent.SwitchDisplayMode:
      return ExtStorage.DisplayMode;
    case ExtEvent.AdjustFontColor:
      return ExtStorage.FontColor;
    case ExtEvent.AdjustFontSize:
      return ExtStorage.FontSize;
    case ExtEvent.SwitchFuriganaType:
      return ExtStorage.FuriganaType;
    case ExtEvent.SwitchSelectMode:
      return ExtStorage.SelectMode;
    case ExtEvent.ToggleAutoMode:
      return ExtStorage.AutoMode;
  }
};

/**
 * Some pages are unable to inject content scripts,
 * so it is not possible to register a message listener with the page,
 * such as `chrome://newtab` and `chrome.google.com`, and this error on those sites is a noise.
 */
export const sendMessage = async (id: number, event: ExtEvent) => {
  try {
    await browser.tabs.sendMessage(id, event);
  } catch (error) {
    if (
      !(error instanceof Error) ||
      error.message !== "Could not establish connection. Receiving end does not exist."
    ) {
      throw error;
    }
  }
};
