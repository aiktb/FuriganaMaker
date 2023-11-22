import Browser from 'webextension-polyfill'

import { Storage } from '@plasmohq/storage'

import {
  defaultConfig,
  ExtensionEvent,
  ExtensionStorage,
  sendMessage,
  toStorageKey,
  type Rule
} from '~contents/core'

import defaultRules from '../../assets/rules.json'

// Plasmo `dev` mode will force the Service Worker to be `active`, it will never become `inactive`.

Browser.runtime.onInstalled.addListener(async () => {
  const storage = new Storage({ area: 'local' })
  for (const key in defaultConfig) {
    const oldConfig = await storage.get(key)
    if (!oldConfig) {
      await storage.set(key, defaultConfig[key])
    }
  }
  const oldRules: Rule[] = await storage.get(ExtensionStorage.UserRules)
  if (!oldRules) {
    await storage.set(ExtensionStorage.UserRules, defaultRules)
  }
})

Browser.commands.onCommand.addListener(async (command, tab) => {
  const storage = new Storage({ area: 'local' })
  switch (command) {
    case ExtensionEvent.AddFurigana:
      await sendMessage(tab!.id!, ExtensionEvent.AddFurigana)
      break
    case ExtensionEvent.ToggleDisplay:
    case ExtensionEvent.ToggleHoverMode:
      {
        const key = toStorageKey(command)
        const oldValue: boolean = await storage.get(toStorageKey(command))
        await storage.set(key, !oldValue)
        await sendMessage(tab!.id!, command)
      }
      break
    default:
      throw new Error('Unknown command')
  }
})

const contextMenuItem: Browser.Menus.CreateCreatePropertiesType = {
  id: ExtensionEvent.AddFurigana,
  title: 'Add furigana on the page',
  contexts: ['page'],
  documentUrlPatterns: ['https://*/*']
}
Browser.contextMenus.create(contextMenuItem)
Browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === ExtensionEvent.AddFurigana) {
    sendMessage(tab!.id!, ExtensionEvent.AddFurigana)
  }
})
