import Browser from 'webextension-polyfill'

import { Storage } from '@plasmohq/storage'

import {
  defaultConfig,
  ExtensionEvent,
  ExtensionStorage,
  Rule,
  sendMessage
} from '~contents/core'

import defaultRules from '../../assets/rules.json'

// Plasmo `dev` mode will force the Service Worker to be `active`, it will never become `inactive`.

const storage = new Storage({ area: 'local' })

Browser.runtime.onInstalled.addListener(async () => {
  for (const key in defaultConfig) {
    const oldConfig = await storage.get(key)
    if (!oldConfig) {
      await storage.set(key, defaultConfig[key])
    }
  }
  const oldRules: Rule[] = await storage.get(ExtensionStorage.UserRule)
  if (!oldRules) {
    await storage.set(ExtensionStorage.UserRule, defaultRules)
  }
})

Browser.commands.onCommand.addListener(async (command, tab) => {
  switch (command) {
    case ExtensionEvent.AddFurigana:
      await sendMessage(tab!.id!, ExtensionEvent.AddFurigana)
      break
    case ExtensionEvent.ToggleDisplay:
    case ExtensionEvent.ToggleHoverMode:
      {
        const oldValue: boolean = await storage.get(command)
        await storage.set(command, !oldValue)
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
  if (info.menuItemId == ExtensionEvent.AddFurigana) {
    sendMessage(tab!.id!, ExtensionEvent.AddFurigana)
  }
})
