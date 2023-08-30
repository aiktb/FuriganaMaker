import type { PlasmoCSConfig } from 'plasmo'
import { toHiragana, toKatakana, toRomaji } from 'wanakana'

import { Storage } from '@plasmohq/storage'

import { CustomEvent, FURIGANA_CLASS, type StyleEvent } from '~contents/core'
import { Selector } from '~contents/customSelector'
import { addFurigana } from '~contents/furiganaMaker'

export const config: PlasmoCSConfig = {
  matches: ['https://*/*'],
  all_frames: true
}

// styleHandler uses storage and is called immediately,
// so it needs to be initialized immediately.
const storage = new Storage({ area: 'local' })
const styleEvents: StyleEvent[] = [
  CustomEvent.SelectMode,
  CustomEvent.FuriganaColor,
  CustomEvent.Display,
  CustomEvent.Fontsize
]
styleEvents.forEach(styleHandler)

// The plasmo Storage watch API could be used instead, but is not necessary.
chrome.runtime.onMessage.addListener((event: CustomEvent) => {
  switch (event) {
    case CustomEvent.FuriganaType:
      furiganaHandler()
      break
    case CustomEvent.Custom:
      customHandler()
      break
    default:
      styleHandler(event)
      break
  }
})

const furiganaHandler = async () => {
  const value = await storage.get(CustomEvent.FuriganaType)
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

let isSelecting = false
const customHandler = () => {
  if (!isSelecting) {
    isSelecting = true
    const selector = new Selector(addFurigana)
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') {
          selector.close()
          isSelecting = false
        }
      },
      { once: true }
    )
  }
}

const rtSelector = `.${FURIGANA_CLASS} > ruby > rt`
const rpSelector = `.${FURIGANA_CLASS} > ruby > rp`
async function styleHandler(type: StyleEvent) {
  const value = await storage.get(type)
  let css: string
  switch (type) {
    case CustomEvent.SelectMode:
      css = `
        .${FURIGANA_CLASS} {
          user-select: ${value === 'furigana' ? 'none' : 'text'};
        }

        ${rtSelector} {
          user-select: ${value === 'original' ? 'none' : 'text'};
        }

        ${rpSelector} {
          display: ${value === 'all' ? 'block' : 'none'};
          position: fixed;
          overflow: hidden;
          white-space: nowrap;
          margin: 0;
          padding: 0;
          height: 0.1px;
          width: 0.1px;
          clip: rect(0 0 0 0);
          clip-path: inset(100%);
          left: -10000px;
        }`
      break
    // <ruby> color will be passed to <rt>, so no control logic for <ruby> color will be added.
    case CustomEvent.FuriganaColor:
      css = `
        ${rtSelector} {
          color: ${value};
        }`
      break
    case CustomEvent.Display:
      css = `
        ${rtSelector} {
          display: ${value ? 'block' : 'none'};
        }`
      break
    case CustomEvent.Fontsize:
      css = `
        ${rtSelector} {
          font-size: ${value}%;
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
