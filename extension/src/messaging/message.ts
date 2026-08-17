import { defineExtensionMessaging } from "@webext-core/messaging";

export type { ExtensionMessage } from "@webext-core/messaging";

import type { FuriganaType } from "@/constants";
import type { KanjiToken } from "@/core/toKanjiToken";

/**
 * A {@link KanjiToken} as it crosses the wire, tagged with whether the user's kanji
 * filter rules match it. Lives here rather than in the background listener so that
 * `messaging` never has to depend on `entrypoints`.
 */
export interface KanjiMark extends KanjiToken {
  isFiltered: boolean;
}

interface ProtocolMap {
  addFurigana(): void;
  canAddFurigana(): boolean;
  /** Marks come back in the order the texts were sent, one entry per text. */
  getKanjiMarks(data: { texts: string[]; furiganaType: FuriganaType }): { tokens: KanjiMark[][] };
  getSelector(data: { domain: string }): { selector: string };
  markActiveTab(): void;
  markDisabledTab(): void;
  modifyKanjiFilter(): void;
  openOptionsPage(): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>({
  breakError: true,
});
