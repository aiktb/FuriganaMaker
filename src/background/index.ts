import Browser from 'webextension-polyfill';

import { Storage } from '@plasmohq/storage';

import {
  defaultConfig,
  ExtensionEvent,
  ExtensionStorage,
  sendMessage,
  toStorageKey,
} from '~contents/core';

import defaultRules from '../../assets/rules/selector.json';

// Plasmo `dev` mode will force the Service Worker to be `active`, it will never become `inactive`.

Browser.runtime.onInstalled.addListener(async () => {
  // Initialize default extension settings and custom rules.
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

Browser.commands.onCommand.addListener(async (command, tab) => {
  const storage = new Storage({ area: 'local' });
  switch (command) {
    case ExtensionEvent.AddFurigana:
      await sendMessage(tab!.id!, ExtensionEvent.AddFurigana);
      break;
    case ExtensionEvent.ToggleDisplay:
    case ExtensionEvent.ToggleHoverMode:
    case ExtensionEvent.ToggleKanjiFilter:
      {
        const key = toStorageKey(command);
        const oldValue: boolean = await storage.get(key);
        await storage.set(key, !oldValue);
        await sendMessage(tab!.id!, command);
      }
      break;
    default:
      throw new Error('Unknown command');
  }
});
