import { isKanji, toKatakana } from 'wanakana'

export type KuromojiToken = {
  // Necessary attributes
  word_position: number // Indexes start from 1
  surface_form: string
  reading: string // Katakana only
  // Unnecessary attributes
  word_id?: number
  word_type?: 'KNOWN' | 'UNKNOWN'
  pos?: string // Part of speech
  pos_detail_1?: string
  pos_detail_2?: string
  pos_detail_3?: string
  conjugated_type?: string
  conjugated_form?: string
  basic_form?: string
  pronunciation?: string
}

// Reference: https://en.wikipedia.org/wiki/Ruby_character
// It's not just kanji, such as "市ヶ谷" (イチガヤ), "我々" (ワレワレ).
export type KurokanjiToken = {
  original: string
  reading: string
  start: number // Indexes start from 0
  end: number
}

export const toKurokanjiToken = (
  kuromojiTokens: KuromojiToken[]
): KurokanjiToken[] => {
  return kuromojiTokens
    .filter(isPhonetic)
    .map(toSimplifiedToken)
    .flatMap(toRubyText)
}

// Reference: https://www.atilika.org/
const isPhonetic = (token: KuromojiToken): boolean => {
  // Reference1: https://unicode.org/reports/tr18/#property_examples
  // Reference2: https://docs.oracle.com/cd/E86824_01/html/E54763/perluniprops-1.html
  const hasKanji = token.surface_form.match(/\p{sc=Han}/u)

  if (
    token.reading &&
    token.reading !== '*' &&
    hasKanji &&
    // Due to kuromoji's flaw, '々' is pronounced '々'
    token.surface_form !== token.reading
  ) {
    return true
  }
  return false
}

interface SimplifiedToken {
  original: string
  reading: string // Convert Katakana to Hiragana
  start: number // Indexes start from 0
  end: number
}

const toSimplifiedToken = (kuromojiToken: KuromojiToken): SimplifiedToken => {
  return {
    original: kuromojiToken.surface_form,
    reading: kuromojiToken.reading,
    start: kuromojiToken.word_position - 1, // Indexes start from 0.
    end: kuromojiToken.word_position - 1 + kuromojiToken.surface_form.length
  }
}

const toRubyText = (
  token: SimplifiedToken
): KurokanjiToken | KurokanjiToken[] => {
  // The pure Kanji words do not need to be disassembled.
  if (isKanji(token.original)) {
    return {
      original: token.original,
      reading: token.reading,
      start: token.start,
      end: token.end
    }
  }
  return smashToken(token)
}

interface MarkToken {
  original: string // Pure katakana.
  start: number
  end: number
}

type MarkTokenArray = MarkToken[] & { hybridLength: number }

// Must be a mixture of Kanji and Kana to use this function.
const smashToken = (token: SimplifiedToken): KurokanjiToken[] => {
  const { original, reading, start, end } = token
  // Both \p{sc=Hira} and \p{sc=Kana} don’t contain 'ー々', which is bad.
  const kanaRegex = /(\p{sc=Hira}|\p{sc=Kana}|ー)+/gu
  const kanas: MarkTokenArray = [...original.matchAll(kanaRegex)].map(
    (match) => ({
      original: match[0],
      start: match.index!,
      end: match.index! + match[0].length
    })
  ) as MarkTokenArray
  kanas.hybridLength = original.length

  const hybridRegex = buildRegex(kanas)

  const kanjisRegex = /\p{sc=Han}+/gu
  const kanjis: KurokanjiToken[] = [...original.matchAll(kanjisRegex)].map(
    (match) => ({
      original: toKatakana(match[0]),
      start: start + match.index!,
      end: start + match.index! + match[0].length
    })
  ) as KurokanjiToken[]
  // The first matching group is the entire string.
  // All that's needed is the subcapturing group.
  const hybridMatch = reading.match(hybridRegex)?.slice(1)
  // If the number of matching groups is not equal to the number of Kanji,
  // it means that the phonetic notation does not correspond to the text.
  // e.g. "関ケ原"(セキガハラ)/"我々"(ワレワレ)
  if (!hybridMatch || hybridMatch.length !== kanjis.length) {
    return [{ original, reading, start, end }]
  }

  for (let i = 0; i < hybridMatch.length; i++) {
    kanjis[i].reading = hybridMatch[i]
  }
  return kanjis
}

// Cases where phonetic notation does not correspond to text create an invalid regular expression.
const buildRegex = (kanas: MarkTokenArray): RegExp => {
  // Match a empty string, actual sub-capturing group is 0.
  if (!kanas.length) {
    return new RegExp('^$', 'u')
  }
  // "作り方"　=>　"^(.+)リ(.+)$", "り方"　=>　"^リ(.+)$", "作り"　=>　"^(.+)リ$".
  const firstKana = kanas[0]
  const lastKana = kanas[kanas.length - 1]
  let regex = '^'
  const placeholder = '(.+)'
  if (firstKana.start) {
    regex += placeholder
  }
  for (const kana of kanas) {
    regex += kana.original
    if (kana !== lastKana) {
      regex += placeholder
    }
  }
  if (lastKana.end !== kanas.hybridLength) {
    regex += placeholder
  }
  regex += '$'
  return new RegExp(regex, 'u')
}