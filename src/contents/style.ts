import type { PlasmoCSConfig } from 'plasmo'

import { Storage } from '@plasmohq/storage'

import type { Select } from './core'
import { Change, Class } from './core'

export const config: PlasmoCSConfig = {
  matches: ['https://twitter.com/*'],
  all_frames: true
}

const storage = new Storage()
storage.get(Change.Select).then((select) => {
  changeSelectMode(select as Select)
})

chrome.runtime.onMessage.addListener(
  (message: { type: Change; value: string }, _sender, _sendResponse) => {
    if (message.type === Change.Select) {
      changeSelectMode(message.value as Select)
    }
  }
)

const changeSelectMode = (select: Select) => {
  const css = `
  .furigana > rt {
    user-select: ${select === 'off' ? 'none' : 'auto'};
  }`
  const oldStyle = document.getElementById(Class.Select)
  if (oldStyle) {
    oldStyle.textContent = css
  } else {
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.setAttribute('id', Class.Select)
    style.textContent = css
    document.head.appendChild(style)
  }
}
