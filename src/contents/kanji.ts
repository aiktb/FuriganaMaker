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
  original: string
  start: number
  end: number
}

type MarkTokenArray = MarkToken[] & { hybridLength: number }

// Must be a mixture of Kanji and Kana to use this function.
const smashToken = (token: SimplifiedToken): KurokanjiToken[] => {
  // Both \p{sc=Hira} and \p{sc=Kana} don’t contain 'ー々', which is bad.
  const placeholderRegex = /(\p{sc=Hira}|\p{sc=Kana}|[ー々〇])+/gu
  const placeholders: MarkTokenArray = [
    ...token.original.matchAll(placeholderRegex)
  ].map((match) => ({
    original: match[0],
    start: match.index!,
    end: match.index! + match[0].length
  })) as MarkTokenArray
  placeholders.hybridLength = token.original.length
  const hybridRegex = buildRegex(placeholders)

  const kanjisRegex = /\p{sc=Han}+/gu
  const kanjis: KurokanjiToken[] = [
    ...token.original.matchAll(kanjisRegex)
  ].map((match) => ({
    original: match[0],
    start: token.start + match.index!,
    end: token.start + match.index! + match[0].length
  })) as KurokanjiToken[]

  // There may be multiple matching groups, which are not processed yet. Tips: matchAll()
  const hybridMatch = token.reading.match(hybridRegex)
  if (!hybridMatch || hybridMatch.length - 1 !== kanjis.length) {
    // '我々' can be treated well.
    return [
      {
        original: token.original,
        reading: token.reading,
        start: token.start,
        end: token.end
      }
    ]
  }
  // The first matching group is the entire string.
  // All that's needed is the subcapturing group.
  for (let i = 1; i < hybridMatch.length; i++) {
    kanjis[i - 1].reading = hybridMatch[i]
  }
  return kanjis
}

// Cases where phonetic notation does not correspond to text create an invalid regular expression.
const buildRegex = (placeholders: MarkTokenArray): RegExp => {
  // "作り方"　=>　"^(.+)リ(.+)$"
  let regexStr = '^'
  const firstToken = placeholders[0]
  const placeholder = '(.+)'
  // catch TypeError
  if (firstToken.start !== 0) {
    regexStr += placeholder
  }
  for (const [i, kana] of placeholders.entries()) {
    regexStr += toKatakana(kana.original)
    if (i < placeholders.length - 1) {
      regexStr += placeholder
    }
  }
  const lastToken = placeholders[placeholders.length - 1]
  if (lastToken.end !== placeholders.hybridLength) {
    regexStr += placeholder
  }
  regexStr += '$'
  return new RegExp(regexStr, 'u')
}
