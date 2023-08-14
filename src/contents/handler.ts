import type { PlasmoCSConfig } from 'plasmo'
import { toHiragana, toKatakana, toRomaji } from 'wanakana'

import { Storage } from '@plasmohq/storage'

import {
  addFurigana,
  Event,
  FURIGANA_CLASS_NAME,
  type StyleEvent
} from '~util/core'
import { Selector } from '~util/selector'

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  all_frames: true
}

const styleEvents: StyleEvent[] = [
  Event.SelectMode,
  Event.FuriganaColor,
  Event.Display,
  Event.Fontsize
]
styleEvents.forEach(styleHandler)

chrome.runtime.onMessage.addListener((event: Event) => {
  switch (event) {
    case Event.FuriganaType:
      furiganaHandler()
      break
    case Event.Engine:
      break
    case Event.Custom:
      customHandler()
      break
    default:
      styleHandler(event)
      break
  }
})

const furiganaHandler = async () => {
  const storage = new Storage()
  const value = await storage.get(Event.FuriganaType)
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
  const selector = new Selector((element: HTMLElement) => {
    addFurigana([element])
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      selector.close()
    }
  })
}

const rtSelector = `.${FURIGANA_CLASS_NAME} > ruby > rt`
const rpSelector = `.${FURIGANA_CLASS_NAME} > ruby > rp`
async function styleHandler(type: StyleEvent) {
  const storage = new Storage()
  const value = await storage.get(type)
  let css: string
  switch (type) {
    case Event.SelectMode:
      css = `
        .${FURIGANA_CLASS_NAME} {
          user-select: ${value === 'furigana' ? 'none' : 'text'};
        }
        
        ${rtSelector} {
          user-select: ${value === 'original' ? 'none' : 'text'};
        }
        
        ${rpSelector} {
          display: ${value === 'all' ? 'block' : 'none'};
          position: absolute;
          left: -9999px;
        }`
      break
    // <ruby> color will be passed to <rt>, so no control logic for <ruby> color will be added.
    case Event.FuriganaColor:
      css = `
        ${rtSelector} {
          color: ${value};
        }`
      break
    case Event.Display:
      css = `
        ${rtSelector} {
          display: ${value ? 'block' : 'none'};
        }`
      break
    case Event.Fontsize:
      css = `
        ${rtSelector} {
          font-size: ${value}%;
        }`
      break
  }
  const id = `${FURIGANA_CLASS_NAME}${type}`
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
