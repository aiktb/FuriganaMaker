import type { PlasmoCSConfig } from 'plasmo'
import { toHiragana, toKatakana, toRomaji } from 'wanakana'

import { Storage } from '@plasmohq/storage'

import { Change, type Furigana } from '~contents/core'

export const config: PlasmoCSConfig = {
  matches: ['https://twitter.com/*'],
  all_frames: true
}

const storage = new Storage()
// prettier-ignore
for (const type of [Change.Select, Change.Color, Change.Display, Change.Fontsize]) {
  storage.get(type).then((value) => {
    styleHandler(type, value)
  })
}

chrome.runtime.onMessage.addListener(
  (message: { type: Change; value: string }, _sender, _sendResponse) => {
    const { type, value } = message
    if (
      type === Change.Select ||
      type === Change.Color ||
      type === Change.Display ||
      type === Change.Fontsize
    ) {
      styleHandler(type, value)
    } else if (type === Change.Furigana) {
      furiganaHandler(value as Furigana)
    }
  }
)

const styleHandler = (type: Change, value: string) => {
  let css: string
  switch (type) {
    case Change.Select:
      css = `
        .furigana > rt {
          user-select: ${value === 'off' ? 'none' : 'auto'};
        }`
      break
    case Change.Color:
      css = `
        .furigana > rt {
          color: ${value};
        }`
      break
    case Change.Display:
      css = `
        .furigana > rt {
          display: ${value === 'off' ? 'none' : 'auto'};
        }`
      break
    case Change.Fontsize:
      css = `
        .furigana > rt {
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
  const nodes = document.querySelectorAll('.furigana > rt')
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
