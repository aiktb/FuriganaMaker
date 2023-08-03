import type { PlasmoCSConfig } from 'plasmo'
import { toHiragana, toKatakana, toRomaji } from 'wanakana'

import { Storage } from '@plasmohq/storage'

import { Event, type Furigana } from '~contents/core'

export const config: PlasmoCSConfig = {
  matches: ['https://twitter.com/*'],
  all_frames: true
}

const storage = new Storage()
// prettier-ignore
for (const type of [Event.Select, Event.Color, Event.Display, Event.Fontsize]) {
  storage.get(type).then((value) => {
    styleHandler(type, value)
  })
}

chrome.runtime.onMessage.addListener(
  (message: { type: Event; value: string }) => {
    const { type, value } = message
    switch (type) {
      case Event.Furigana:
        furiganaHandler(value as Furigana)
        break
      default:
        styleHandler(type, value)
        break
    }
  }
)

const rtSelector = '.furigana > ruby > rt'
const styleHandler = (type: Event, value: string) => {
  let css: string
  switch (type) {
    case Event.Select:
      css = `
        .furigana {
          user-select: ${value === 'furigana' ? 'none' : 'text'};
        }
        
        ${rtSelector} {
          user-select: ${value === 'original' ? 'none' : 'text'};
        }`
      break
    case Event.Color:
      css = `
        ${rtSelector} {
          color: ${value};
        }`
      break
    case Event.Display:
      css = `
        ${rtSelector} {
          display: ${value === 'off' ? 'none' : 'auto'};
        }`
      break
    case Event.Fontsize:
      css = `
        ${rtSelector} {
          font-size: ${value}%;
        }`
      break
    default:
      throw new Error('Invalid Style Event Type')
  }
  const id = `furigana-${type}`
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

const furiganaHandler = (value: Furigana) => {
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
