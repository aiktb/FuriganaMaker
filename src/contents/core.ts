import type { KurokanjiToken, KuromojiToken } from 'kurokanji'
import { toKurokanjiToken } from 'kurokanji'
import { toHiragana, toRomaji } from 'wanakana'

import { sendToBackground } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

export const FURIGANA_CLASS_NAME = '--furigana--'

export enum Event {
  FuriganaType = 'FuriganaType',
  SelectMode = 'SelectMode',
  OriginalColor = 'OriginalColor',
  FuriganaColor = 'FuriganaColor',
  Display = 'Display',
  Fontsize = 'Fontsize',
  Engine = 'Engine',
  Custom = 'Custom'
}
export type ChangeEvent =
  | Event.OriginalColor
  | Event.FuriganaColor
  | Event.Display
  | Event.Fontsize
  | Event.FuriganaType
  | Event.SelectMode

export type Config = {
  FuriganaType: FuriganaType
  OriginalColor: OriginalColor
  FuriganaColor: FuriganaColor
  SelectMode: SelectMode
  Display: Display
  Fontsize: Fontsize
  Engine: Engine
}

export const defaultConfig: Config = {
  FuriganaType: 'hiragana',
  OriginalColor: 'currentColor',
  FuriganaColor: 'currentColor',
  SelectMode: 'original',
  Display: 'on',
  Fontsize: 75, // ${fontsize}% relative to the parent font.
  Engine: 'remote'
}

export type FuriganaType = 'hiragana' | 'katakana' | 'romaji'
export type Display = 'on' | 'off'
export type SelectMode = 'original' | 'furigana' | 'all'
export type FuriganaColor = string
export type OriginalColor = string
export type Fontsize = number
export type Engine = 'local' | 'remote'

/**
 * Append ruby tag to all text nodes of a batch of elements.
 * @remarks
 * The parent element of the text node will be added with the FURIGANA_CLASS_NAME class.
 * Elements that have already been marked will be skipped.
 * Ruby tag is "\<ruby>original\<rt>reading\</rt>\</ruby>".
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
  if (element.parentElement!.classList.contains(FURIGANA_CLASS_NAME)) {
    return []
  }
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
  const furiganaType: FuriganaType = await storage.get(Event.FuriganaType)
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
