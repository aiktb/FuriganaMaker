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

import defaultRules from '../../assets/rules/selector.json';

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
  const oldRules = await storage.get(ExtensionStorage.UserRules);
  if (!oldRules) {
    await storage.set(ExtensionStorage.UserRules, defaultRules);
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
      break;
    }
    case 'hideFurigana': {
      await storage.set(ExtensionStorage.DisplayMode, DisplayMode.Never);
      break;
    }
    case 'showFurigana': {
      await storage.set(ExtensionStorage.DisplayMode, DisplayMode.Always);
      break;
    }
    case 'openHoverMode': {
      await storage.set(ExtensionStorage.DisplayMode, DisplayMode.Hover);
      break;
    }
    case 'openHoverNoGapMode': {
      await storage.set(ExtensionStorage.DisplayMode, DisplayMode.HoverNoGap);
      break;
    }
    default:
      throw new Error('Unknown command');
  }
});
