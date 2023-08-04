import { toHiragana, toRomaji } from 'wanakana'

import { sendToBackground } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

import type { KurokanjiToken, KuromojiToken } from '~contents/kanji'
import { toKurokanjiToken } from '~contents/kanji'

export const FURIGANA_CLASS_NAME = '--furigana--'

export enum Event {
  Furigana = 'furigana',
  Select = 'select',
  Color = 'color',
  Display = 'display',
  Fontsize = 'fontsize'
}

export type Default = {
  furigana: Furigana
  color: Color
  select: Select
  display: Display
  fontsize: Fontsize
}

export const defaultValue: Default = {
  furigana: 'hiragana',
  color: 'currentColor',
  select: 'original',
  display: 'on',
  fontsize: 75
}

export type Furigana = 'hiragana' | 'katakana' | 'romaji'
export type Display = 'on' | 'off'
export type Select = 'original' | 'furigana' | 'all'
export type Color = string
export type Fontsize = number

/**
 * Append ruby tag to all text nodes of a batch of nodes.
 *
 * @remarks
 *
 * The parent node of the text node will be added with the FURIGANA_CLASS_NAME class.
 * Ruby tag is "\<ruby>original\<rt>reading\</rt>\</ruby>"
 **/
export const addFurigana = async (elements: Element[]) => {
  const jaTextElements = elements.flatMap(collectTextElementsAndMark)
  for (const element of jaTextElements) {
    const tokens: KurokanjiToken[] = await tokenize(element.textContent!)
    // reverse() prevents the range from being invalidated
    for (const token of tokens.reverse()) {
      const ruby = await createRuby(token.original, token.reading)
      const range = document.createRange()
      range.setStart(element, token.start)
      range.setEnd(element, token.end)
      range.deleteContents()
      range.insertNode(ruby)
    }
  }
}
const collectTextElementsAndMark = (element: Element): Element[] => {
  const textElements: Element[] = []
  if (element.nodeType === Node.TEXT_NODE && element.textContent?.length) {
    element.parentElement!.classList.add(FURIGANA_CLASS_NAME)
    textElements.push(element)
  } else {
    const elements = Array.from(
      element.childNodes as NodeListOf<Element>
    ).flatMap(collectTextElementsAndMark)
    textElements.push(...elements)
  }
  return textElements
}

const tokenize = async (text: string): Promise<KurokanjiToken[]> => {
  const response = await sendToBackground<
    { text: string },
    { message: KuromojiToken[] }
  >({ name: 'fetchKuromoji', body: { text } })
  return toKurokanjiToken(response.message)
}

const createRuby = async (
  original: string,
  reading: string
): Promise<HTMLElement> => {
  const rubyNode = document.createElement('ruby')
  const originalTextNode = document.createTextNode(original)

  const storage = new Storage()
  const furiganaType: Furigana = await storage.get(Event.Furigana)
  switch (furiganaType) {
    case 'hiragana':
      reading = toHiragana(reading)
      break
    case 'romaji':
      reading = toRomaji(reading)
      break
    case 'katakana':
      // token.reading default is katakana
      break
  }
  const readingTextNode = document.createTextNode(reading)
  const rt = document.createElement('rt')
  rt.appendChild(readingTextNode)
  rubyNode.appendChild(originalTextNode)
  rubyNode.appendChild(rt)
  return rubyNode
}
