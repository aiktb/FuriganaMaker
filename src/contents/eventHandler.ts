import type { PlasmoCSConfig } from 'plasmo'
import { toHiragana, toKatakana, toRomaji } from 'wanakana'
import Browser from 'webextension-polyfill'

import { Storage } from '@plasmohq/storage'

import { ExtensionEvent, FURIGANA_CLASS, type StyleEvent } from './core'
import { Selector } from './customSelector'

export const config: PlasmoCSConfig = {
  matches: ['https://*/*']
}

// styleHandler uses storage and is called immediately,
// so it needs to be initialized immediately.
const storage = new Storage({ area: 'local' })
const styleEvents: StyleEvent[] = [
  ExtensionEvent.Display,
  ExtensionEvent.Hover,
  ExtensionEvent.Select,
  ExtensionEvent.Fontsize,
  ExtensionEvent.Color
]
styleEvents.forEach(styleHandler)

// The plasmo Storage watch API could be used instead, but is not necessary.
Browser.runtime.onMessage.addListener((event: ExtensionEvent) => {
  switch (event) {
    case ExtensionEvent.Furigana:
      furiganaHandler()
      break
    case ExtensionEvent.Custom:
      customHandler()
      break
    default:
      styleHandler(event)
      break
  }
})

const furiganaHandler = async () => {
  const value = await storage.get(ExtensionEvent.Furigana)
  const nodes = document.querySelectorAll(rtSelector)
  switch (value) {
    case 'hiragana':
      nodes.forEach((node) => {
        node.textContent = toHiragana(node.textContent!)
      })
      break
    case 'katakana':
      nodes.forEach((node) => {
        node.textContent = toKatakana(node.textContent!)
      })
      break
    case 'romaji':
      nodes.forEach((node) => {
        node.textContent = toRomaji(node.textContent!)
      })
      break
  }
}

// Extensions cannot send messages to content scripts using `Browser.runtime.sendMessage`.
const customHandler = () => {
  const selector = Selector.create()
  const selectHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      selector.close()
      document.removeEventListener('keydown', selectHandler)
    }
  }
  selector.open()
  document.addEventListener('keydown', selectHandler)
}

const rtSelector = `ruby.${FURIGANA_CLASS} > rt`
const rtHoverSelector = `ruby.${FURIGANA_CLASS}:hover > rt`
async function styleHandler(type: StyleEvent) {
  const value = await storage.get(type)
  let css: string
  switch (type) {
    case ExtensionEvent.Display:
      css = `
        ${rtSelector} {
          display: ${value ? 'revert' : 'none'};
        }
      `
      break
    case ExtensionEvent.Hover:
      css = `
        ${rtSelector} {
          opacity: ${value ? 0 : 1};
        }

        ${rtHoverSelector} {
          opacity: 1;
        }
      `
      break
    case ExtensionEvent.Select:
      css = `
        ${rtSelector} {
          user-select: ${value === 'original' ? 'none' : 'text'};
        }
      `
      break
    case ExtensionEvent.Fontsize:
      css = `
        ${rtSelector} {
          font-size: ${value}%;
        }
      `
      break
    case ExtensionEvent.Color:
      css = `
        ${rtSelector} {
          color: ${value};
        }
      `
      break
  }
  const id = `${FURIGANA_CLASS}${type}`
  const oldStyle = document.getElementById(id)
  if (oldStyle) {
    oldStyle.textContent = css
  } else {
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.setAttribute('id', id)
    style.textContent = css
    document.head.appendChild(style)
  }
}
