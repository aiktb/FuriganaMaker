import type { PlasmoCSConfig } from 'plasmo'
import { toHiragana, toKatakana, toRomaji } from 'wanakana'

import { Storage } from '@plasmohq/storage'

import { Event, FURIGANA_CLASS_NAME } from '~contents/core'

export const config: PlasmoCSConfig = {
  matches: ['https://twitter.com/*'],
  all_frames: true
}

Array.from([
  Event.Select,
  Event.Color,
  Event.Display,
  Event.Fontsize,
  Event.Engine
]).forEach(styleHandler)

chrome.runtime.onMessage.addListener((event: Event) => {
  switch (event) {
    case Event.Furigana:
      furiganaHandler()
      break
    case Event.Engine:
      break
    case Event.Custom:
      break
    default:
      styleHandler(event)
      break
  }
})

const rtSelector = `.${FURIGANA_CLASS_NAME} > ruby > rt`
async function styleHandler(type: Event) {
  const storage = new Storage()
  const value = await storage.get(type)
  let css: string
  switch (type) {
    case Event.Select:
      css = `
        .${FURIGANA_CLASS_NAME} {
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
          display: ${value === 'off' ? 'none' : 'flow'};
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

const furiganaHandler = async () => {
  const storage = new Storage()
  const value = await storage.get(Event.Furigana)
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
