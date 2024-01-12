import type { PlasmoCSConfig } from 'plasmo';
import { toHiragana, toKatakana, toRomaji } from 'wanakana';
import Browser from 'webextension-polyfill';

import { Storage } from '@plasmohq/storage';

import {
  ExtensionEvent,
  ExtensionStorage,
  FURIGANA_CLASS,
  FuriganaType,
  SelectMode,
  toStorageKey,
  type StyleEvent,
} from './core';
import { Selector } from './customSelector';

export const config: PlasmoCSConfig = {
  matches: ['https://*/*'],
};

// styleHandler uses storage and is called immediately,
// so it needs to be initialized immediately.
initialize();
async function initialize() {
  const styleEvents: StyleEvent[] = [
    ExtensionEvent.ToggleDisplay,
    ExtensionEvent.ToggleHoverMode,
    ExtensionEvent.SwitchSelectMode,
    ExtensionEvent.AdjustFontSize,
    ExtensionEvent.AdjustFontColor,
    ExtensionEvent.ToggleKanjiFilter,
  ];
  await Promise.all(styleEvents.map((item) => styleHandler(item)));
}

// The plasmo Storage watch API could be used instead, but is not necessary.
Browser.runtime.onMessage.addListener((event: ExtensionEvent) => {
  switch (event) {
    case ExtensionEvent.SwitchFuriganaType:
      switchFuriganaHandler();
      break;
    case ExtensionEvent.AddFurigana:
      addFuriganaHandler();
      break;
    default:
      styleHandler(event);
      break;
  }
});

async function switchFuriganaHandler() {
  const rtSelector = `ruby.${FURIGANA_CLASS} > rt`;
  const nodes = document.querySelectorAll(rtSelector);
  const storage = new Storage({ area: 'local' });
  const value: FuriganaType = await storage.get(ExtensionStorage.FuriganaType);
  switch (value) {
    case FuriganaType.Hiragana:
      nodes.forEach((node) => {
        node.textContent = toHiragana(node.textContent!);
      });
      break;
    case FuriganaType.Katakana:
      nodes.forEach((node) => {
        node.textContent = toKatakana(node.textContent!);
      });
      break;
    case FuriganaType.Romaji:
      nodes.forEach((node) => {
        node.textContent = toRomaji(node.textContent!);
      });
      break;
  }
}

function addFuriganaHandler() {
  const selector = Selector.create();
  const selectHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      selector.close();
      document.removeEventListener('keydown', selectHandler);
    }
  };
  selector.open();
  document.addEventListener('keydown', selectHandler);
}

async function styleHandler(type: StyleEvent) {
  const rtSelector = `ruby.${FURIGANA_CLASS} > rt`;
  const rtHoverSelector = `ruby.${FURIGANA_CLASS}:hover > rt`;
  const rpSelector = `ruby.${FURIGANA_CLASS} > rp`;
  const n5RtSelector = `ruby.${FURIGANA_CLASS}.n5 > rt`;
  const storage = new Storage({ area: 'local' });

  const value = await storage.get(toStorageKey(type));
  let css: string;
  switch (type) {
    case ExtensionEvent.ToggleDisplay:
      css = `
        ${rtSelector} {
          display: ${value ? 'revert' : 'none !important'};
        }
      `;
      break;
    case ExtensionEvent.ToggleHoverMode:
      css = `
        ${rtSelector} {
          opacity: ${value ? 0 : 1};
        }

        ${rtHoverSelector} {
          opacity: 1;
        }
      `;
      break;
    case ExtensionEvent.SwitchSelectMode:
      css = `
        ${rtSelector} {
          user-select: ${value === SelectMode.Original ? 'none' : 'text'};
        }

        ${rpSelector} {
          display: ${value === SelectMode.Parentheses ? 'block' : 'none'};
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `;
      break;
    case ExtensionEvent.AdjustFontSize:
      css = `
        ${rtSelector} {
          font-size: ${value}%;
        }
      `;
      break;
    case ExtensionEvent.AdjustFontColor:
      css = `
        ${rtSelector} {
          color: ${value};
        }
      `;
      break;
    case ExtensionEvent.ToggleKanjiFilter:
      css = `
        ${n5RtSelector} {
          display: ${value ? 'none' : 'revert'};
        }
      `;
      break;
  }
  const id = `${FURIGANA_CLASS}${type}`;
  const oldStyle = document.getElementById(id);
  if (oldStyle) {
    oldStyle.textContent = css;
  } else {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('id', id);
    style.textContent = css;
    document.head.appendChild(style);
  }
}
