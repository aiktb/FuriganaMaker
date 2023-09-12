import type { PlasmoCSConfig } from 'plasmo'
import { toHiragana, toKatakana, toRomaji } from 'wanakana'
import Browser from 'webextension-polyfill'

import { Storage } from '@plasmohq/storage'

import { ExtensionEvent, FURIGANA_CLASS, type StyleEvent } from '~contents/core'
import { Selector } from '~contents/customSelector'

export const config: PlasmoCSConfig = {
  matches: ['https://*/*'],
  all_frames: true
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

const customHandler = () => {
  const selector = Selector.create()
  selector.open()
  const selectHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      selector.close()
      document.removeEventListener('keydown', selectHandler)
    }
  }
  document.addEventListener('keydown', selectHandler)
}

const furiganaSelector = `.${FURIGANA_CLASS}`
const rtSelector = `.${FURIGANA_CLASS} ruby > rt`
const rpSelector = `.${FURIGANA_CLASS} ruby > rp`
const rtHoverSelector = `.${FURIGANA_CLASS} ruby:hover > rt`
async function styleHandler(type: StyleEvent) {
  const value = await storage.get(type)
  let css: string
  switch (type) {
    case ExtensionEvent.Display:
      css = `
        ${rtSelector} {
          display: ${value ? 'revert' : 'none'};
        }`
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
        ${furiganaSelector} {
          user-select: ${value === 'furigana' ? 'none' : 'text'};
        }

        ${rtSelector} {
          user-select: ${value === 'original' ? 'none' : 'text'};
        }

        ${rpSelector} {
          display: ${value === 'all' ? 'block' : 'none'};
          position: fixed;
          left: -10000px;
        }`
      break
    case ExtensionEvent.Fontsize:
      css = `
          ${rtSelector} {
            font-size: ${value}%;
          }`
      break
    // <ruby> color will be passed to <rt>, so no control logic for <ruby> color will be added.
    case ExtensionEvent.Color:
      css = `
        ${rtSelector} {
          color: ${value};
        }`
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
