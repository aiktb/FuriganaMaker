import Browser from "webextension-polyfill";
import { ExtensionEvent, ExtensionStorage, type StorageChangeEvent } from "./constants";

export const toStorageKey = (event: StorageChangeEvent) => {
  switch (event) {
    case ExtensionEvent.ToggleKanjiFilter:
      return ExtensionStorage.KanjiFilter;
    case ExtensionEvent.SwitchDisplayMode:
      return ExtensionStorage.DisplayMode;
    case ExtensionEvent.AdjustFontColor:
      return ExtensionStorage.FontColor;
    case ExtensionEvent.AdjustFontSize:
      return ExtensionStorage.FontSize;
    case ExtensionEvent.SwitchFuriganaType:
      return ExtensionStorage.FuriganaType;
    case ExtensionEvent.SwitchSelectMode:
      return ExtensionStorage.SelectMode;
    case ExtensionEvent.ToggleAutoMode:
      return ExtensionStorage.AutoMode;
  }
};

export const sendMessage = async (id: number, event: ExtensionEvent) => {
  try {
    await Browser.tabs.sendMessage(id, event);
  } catch (error) {
    if (
      !(error instanceof Error) ||
      error.message !== "Could not establish connection. Receiving end does not exist."
    ) {
      throw error;
    }
  }
};
