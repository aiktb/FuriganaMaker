import { match } from "ts-pattern";
import { toHiragana, toRomaji } from "wanakana";
import { DB, FuriganaType } from "@/constants";
import { toKanjiToken } from "@/core/toKanjiToken";
import { initAsync, type Tokenizer, TokenizerBuilder } from "@/core/tokenize";
import { type KanjiMark, onMessage } from "@/messaging/message";
import { getKanjiFilterDB } from "@/storage/kanjiFilterDB";

class Deferred {
  promise: Promise<Tokenizer>;
  resolve!: (value: Tokenizer) => void;
  reject!: (reason: Error) => void;
  constructor() {
    this.promise = new Promise<Tokenizer>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

const deferredTokenizer = new Deferred();
let tokenizerIsLoading = true;

const getTokenizer = async () => {
  if (!tokenizerIsLoading) {
    return await deferredTokenizer.promise;
  }
  try {
    await initAsync();
    const builder = new TokenizerBuilder();
    const tokenizer = builder.build();
    deferredTokenizer.resolve(tokenizer);
  } catch (error) {
    deferredTokenizer.reject(error as Error);
  } finally {
    tokenizerIsLoading = false;
  }
  return await deferredTokenizer.promise;
};

type KanjiFilterMap = Map<string, string[] | "*">;

let kanjiFilterMap: KanjiFilterMap | null = null;
const getKanjiFilterMap = async () => {
  if (kanjiFilterMap) {
    return kanjiFilterMap;
  }
  const db = await getKanjiFilterDB();
  const filterRules = await db.getAll(DB.onlyTable);
  const filterMap: KanjiFilterMap = new Map(
    filterRules.map((filterRule) => [filterRule.kanji, filterRule.yomikatas ?? "*"]),
  );
  kanjiFilterMap = filterMap;
  return filterMap;
};

const toKanjiMarks = (
  tokenizer: Tokenizer,
  filterMap: KanjiFilterMap,
  text: string,
  furiganaType: FuriganaType,
): KanjiMark[] => {
  return toKanjiToken(tokenizer.tokenize(text), text).map((token) => {
    const yomikatas = filterMap.get(token.original);
    const isFiltered =
      yomikatas !== undefined && (yomikatas === "*" || yomikatas.includes(token.reading));
    return {
      ...token,
      reading: match(furiganaType)
        .with(FuriganaType.Hiragana, () => toHiragana(token.reading))
        .with(FuriganaType.Romaji, () => toRomaji(token.reading))
        .with(FuriganaType.Katakana, () => token.reading)
        .exhaustive(),
      isFiltered,
    };
  });
};

export const registerOnGetKanjiMarksMessage = () => {
  onMessage("modifyKanjiFilter", () => {
    kanjiFilterMap = null;
  });
  onMessage("getKanjiMarks", async ({ data }) => {
    // Awaited once for the whole batch rather than once per text.
    const tokenizer = await getTokenizer();
    const filterMap = await getKanjiFilterMap();
    const tokens = data.texts.map((text) =>
      toKanjiMarks(tokenizer, filterMap, text, data.furiganaType),
    );

    return { tokens };
  });
};
