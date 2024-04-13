import kuromoji from "@sglkc/kuromoji";

import type { PlasmoMessaging } from "@plasmohq/messaging";
import { type KanjiToken, type MojiToken, toKanjiToken } from "~core/toKanjiToken";
// `filter.json` exceeded Browser.storage.local` maximum limit.
import filterList from "../../../assets/rules/filter.json";

interface Tokenizer {
  tokenize: (text: string) => MojiToken[];
}

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

const deferred = new Deferred();
let isLoading = false;

const getTokenizer = async () => {
  if (isLoading) {
    return await deferred.promise;
  }
  isLoading = true;
  const builder = kuromoji.builder({
    // This function relies on web_accessible_resources.
    dicPath: "/",
  });
  builder.build((err: undefined | Error, tokenizer: Tokenizer) => {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(tokenizer);
    }
  });
  return await deferred.promise;
};

export interface KanjiMark extends KanjiToken {
  isFiltered: boolean;
}

const handler: PlasmoMessaging.MessageHandler<{ text: string }, { message: KanjiMark[] }> = async (
  req,
  res,
) => {
  const tokenizer = await getTokenizer();
  const mojiTokens = tokenizer.tokenize(req.body!.text);
  const filterMap = new Map<string, string[]>(
    filterList.map((filterRule) => [filterRule.kanji, filterRule.reading]),
  );
  const message = toKanjiToken(mojiTokens).map((token) => {
    return {
      ...token,
      isFiltered:
        filterMap.has(token.original) && filterMap.get(token.original)!.includes(token.reading),
    };
  });

  res.send({ message });
};

export default handler;
