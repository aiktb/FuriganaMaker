import _initAsync, {
  type Tokenizer as _Tokenizer,
  TokenizerBuilder as _TokenizerBuilder,
} from "lindera-wasm-ipadic-web";

export type FormattedToken = {
  byteEnd: number;
  byteStart: number;
  surface: string;
  reading: string;
};

export class Tokenizer {
  #superTokenizer: _Tokenizer;
  constructor(tokenizer: _Tokenizer) {
    this.#superTokenizer = tokenizer;
  }
  tokenize(inputText: string): FormattedToken[] {
    const tokens = this.#superTokenizer.tokenize(inputText).map((token) => ({
      byteEnd: token.byte_end,
      byteStart: token.byte_start,
      surface: token.surface,
      reading: token.details[7] ?? "*",
    }));
    return tokens;
  }
}
export class TokenizerBuilder {
  #superTokenizerBuilder: _TokenizerBuilder;
  constructor() {
    this.#superTokenizerBuilder = new _TokenizerBuilder();
  }
  build(): Tokenizer {
    this.#superTokenizerBuilder.setDictionary("embedded://ipadic");
    this.#superTokenizerBuilder.setMode("normal");
    this.#superTokenizerBuilder.appendCharacterFilter("unicode_normalize", { kind: "nfkc" });
    this.#superTokenizerBuilder.appendTokenFilter("lowercase", {});
    this.#superTokenizerBuilder.appendTokenFilter("japanese_compound_word", {
      kind: "ipadic",
      tags: ["名詞,数"],
      new_tag: "名詞,数",
    });
    const superTokenizer = this.#superTokenizerBuilder.build();
    return new Tokenizer(superTokenizer);
  }
}

export async function initAsync(): Promise<void> {
  await _initAsync();
}
