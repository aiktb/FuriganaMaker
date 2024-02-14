import Browser from 'webextension-polyfill';

import { Storage } from '@plasmohq/storage';

import {
  DisplayMode,
  ExtensionEvent,
  ExtensionStorage,
  FuriganaType,
  SelectMode,
  sendMessage,
  type Config,
} from '~contents/core';

// Default kanji filter level is N5.
import defaultFilterRules from '../../assets/rules/filter.json';
import defaultSelectorRules from '../../assets/rules/selector.json';

// Plasmo `dev` mode will force the Service Worker to be `active`, it will never become `inactive`.

Browser.runtime.onInstalled.addListener(async () => {
  // Initialize default extension settings and custom rules.
  const defaultConfig: Config = {
    [ExtensionStorage.AutoMode]: true,
    [ExtensionStorage.KanjiFilter]: false,
    [ExtensionStorage.DisplayMode]: DisplayMode.Always,
    [ExtensionStorage.FuriganaType]: FuriganaType.Hiragana,
    [ExtensionStorage.SelectMode]: SelectMode.Original,
    [ExtensionStorage.FontSize]: 75, // ${fontsize}% relative to the parent font.
    [ExtensionStorage.FontColor]: 'currentColor',
  };
  const storage = new Storage({ area: 'local' });
  for (const key of Object.keys(defaultConfig)) {
    const oldConfig = await storage.get(key);
    if (!oldConfig) {
      await storage.set(key, defaultConfig[key]);
    }
  }

  const oldSelectorRules = await storage.get(ExtensionStorage.SelectorRules);
  if (!oldSelectorRules) {
    await storage.set(ExtensionStorage.SelectorRules, defaultSelectorRules);
  }

  const oldKanjiRules = await storage.get(ExtensionStorage.FilterRules);
  if (!oldKanjiRules) {
    await storage.set(ExtensionStorage.FilterRules, defaultFilterRules);
  }

  // Setting the contextMenu must not be outside of `runtime.onInstalled`,
  // otherwise it will report an error for creating the contextMenu multiple times.
  const contextMenuItem: Browser.Menus.CreateCreatePropertiesType = {
    id: ExtensionEvent.AddFurigana,
    title: 'Add furigana on the page',
    contexts: ['page'],
    documentUrlPatterns: ['https://*/*'],
  };
  Browser.contextMenus.create(contextMenuItem);
});

Browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === ExtensionEvent.AddFurigana) {
    await sendMessage(tab!.id!, ExtensionEvent.AddFurigana);
  }
});

// Please see `package.json` for a list of shortcut keys.
Browser.commands.onCommand.addListener(async (command, tab) => {
  const storage = new Storage({ area: 'local' });
  switch (command) {
    case 'addFurigana': {
      await sendMessage(tab!.id!, ExtensionEvent.AddFurigana);
      break;
    }
    case 'toggleAutoMode': {
      const autoMode: boolean = await storage.get(ExtensionStorage.AutoMode);
      await storage.set(ExtensionStorage.AutoMode, !autoMode);
      break;
    }
    case 'toggleKanjiFilter': {
      const kanjiFilter: boolean = await storage.get(ExtensionStorage.KanjiFilter);
      await storage.set(ExtensionStorage.KanjiFilter, !kanjiFilter);
      await sendMessage(tab!.id!, ExtensionEvent.ToggleKanjiFilter);
      break;
    }
    case 'toggleFuriganaDisplay': {
      const displayMode: DisplayMode = await storage.get(ExtensionStorage.DisplayMode);
      if (displayMode === DisplayMode.Always) {
        await storage.set(ExtensionStorage.DisplayMode, DisplayMode.Never);
        await sendMessage(tab!.id!, ExtensionEvent.SwitchDisplayMode);
      } else {
        await storage.set(ExtensionStorage.DisplayMode, DisplayMode.Always);
        await sendMessage(tab!.id!, ExtensionEvent.SwitchDisplayMode);
      }
      break;
    }
    default:
      throw new Error('Unknown command');
  }
});
