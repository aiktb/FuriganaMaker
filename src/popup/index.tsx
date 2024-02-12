import '~/assets/style.css';

import { Transition } from '@headlessui/react';
import { detect } from 'detect-browser';
import React, { Suspense, use, useReducer } from 'react';
import Browser from 'webextension-polyfill';

import { Storage } from '@plasmohq/storage';

import {
  DisplayMode,
  ExtensionEvent,
  ExtensionStorage,
  FuriganaType,
  SelectMode,
  sendMessage,
  toStorageKey,
  type Config,
} from '~contents/core';

import ColorPickerIcon from 'react:~/assets/icons/ColorPicker.svg';
import CursorOutlineIcon from 'react:~/assets/icons/CursorDefault.svg';
import CursorTextIcon from 'react:~/assets/icons/CursorText.svg';
import EyeIcon from 'react:~/assets/icons/Eye.svg';
import FilterIcon from 'react:~/assets/icons/Filter.svg';
import FontSizeIcon from 'react:~/assets/icons/FontSize.svg';
import GithubIcon from 'react:~/assets/icons/Github.svg';
import HeartIcon from 'react:~/assets/icons/Heart.svg';
import HiraganaIcon from 'react:~/assets/icons/Hiragana.svg';
import Logo from 'react:~/assets/icons/Logo.svg';
import PowerIcon from 'react:~/assets/icons/Power.svg';
import SettingIcon from 'react:~/assets/icons/Setting.svg';
import ShareIcon from 'react:~/assets/icons/Share.svg';

import Button from './components/Button';
import CheckBox from './components/CheckBox';
import ColorPicker from './components/ColorPicker';
import Link from './components/Link';
import RangeSlider from './components/RangeSlider';
import Select from './components/Select';
import SharedCard from './components/SharedCard';

const initializeConfig = async () => {
  const storage = new Storage({ area: 'local' });
  return {
    [ExtensionStorage.AutoMode]: await storage.get(ExtensionStorage.AutoMode),
    [ExtensionStorage.KanjiFilter]: await storage.get(ExtensionStorage.KanjiFilter),
    [ExtensionStorage.DisplayMode]: await storage.get(ExtensionStorage.DisplayMode),
    [ExtensionStorage.FuriganaType]: await storage.get(ExtensionStorage.FuriganaType),
    [ExtensionStorage.SelectMode]: await storage.get(ExtensionStorage.SelectMode),
    [ExtensionStorage.FontSize]: await storage.get(ExtensionStorage.FontSize),
    [ExtensionStorage.FontColor]: await storage.get(ExtensionStorage.FontColor),
  } as Config;
};

export default function Popup() {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return (
    <Suspense fallback={<Logo width="192" height="192" />}>
      <Transition
        appear
        show={true}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Menu configPromise={initializeConfig()} />
      </Transition>
    </Suspense>
  );
}

async function addFurigana() {
  // `chrome.tabs.query` is not compatible with firefox.
  const tabId = (await Browser.tabs.query({ active: true, currentWindow: true })).at(0)!.id!;
  await sendMessage(tabId, ExtensionEvent.AddFurigana);
}

type ACTIONTYPE =
  | { type: ExtensionEvent.ToggleAutoMode; payload: boolean }
  | { type: ExtensionEvent.ToggleKanjiFilter; payload: boolean }
  | { type: ExtensionEvent.SwitchDisplayMode; payload: DisplayMode }
  | { type: ExtensionEvent.SwitchFuriganaType; payload: FuriganaType }
  | { type: ExtensionEvent.SwitchSelectMode; payload: SelectMode }
  | { type: ExtensionEvent.AdjustFontSize; payload: number }
  | { type: ExtensionEvent.AdjustFontColor; payload: string };

function reducer(state: Config, action: ACTIONTYPE) {
  Browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
    const storage = new Storage({ area: 'local' });
    await storage.set(toStorageKey(action.type), action.payload);
    const tabId = tabs[0]!.id!;
    await sendMessage(tabId, action.type);
  });

  switch (action.type) {
    case ExtensionEvent.ToggleAutoMode:
      return { ...state, [ExtensionStorage.AutoMode]: action.payload };
    case ExtensionEvent.ToggleKanjiFilter:
      return { ...state, [ExtensionStorage.KanjiFilter]: action.payload };
    case ExtensionEvent.SwitchDisplayMode:
      return { ...state, [ExtensionStorage.DisplayMode]: action.payload };
    case ExtensionEvent.SwitchFuriganaType:
      return { ...state, [ExtensionStorage.FuriganaType]: action.payload };
    case ExtensionEvent.SwitchSelectMode:
      return { ...state, [ExtensionStorage.SelectMode]: action.payload };
    case ExtensionEvent.AdjustFontSize:
      return { ...state, [ExtensionStorage.FontSize]: action.payload };
    case ExtensionEvent.AdjustFontColor:
      return { ...state, [ExtensionStorage.FontColor]: action.payload };
  }
}

interface MenuItemProps {
  children: React.ReactNode;
  icon: React.ReactNode;
}

function MenuItem({ children, icon }: MenuItemProps) {
  return (
    <li className="flex items-center gap-x-1.5">
      <div className="text-2xl" aria-hidden="true">
        {icon}
      </div>
      {children}
    </li>
  );
}

function Menu({ configPromise }: { configPromise: Promise<Config> }) {
  const [state, dispatch] = useReducer(reducer, use(configPromise));
  // prettier-ignore
  const displayModeOptions = [DisplayMode.Always, DisplayMode.Never, DisplayMode.Hover, DisplayMode.HoverNoGap];
  const furiganaTypeOptions = [FuriganaType.Hiragana, FuriganaType.Katakana, FuriganaType.Romaji];
  const browser = detect();
  // `SelectMode.Parentheses` is not compatible with firefox.
  const selectModeOptions =
    browser?.name === 'firefox'
      ? [SelectMode.Default, SelectMode.Original]
      : [SelectMode.Default, SelectMode.Original, SelectMode.Parentheses];

  return (
    <menu className="space-y-2 border-r-2 border-primary pr-2">
      <MenuItem icon={<CursorOutlineIcon />}>
        <Button tip="Press ESC to cancel" text="Add furigana" onClick={addFurigana} />
      </MenuItem>
      <MenuItem icon={<PowerIcon className={state.autoMode ? 'text-primary' : ''} />}>
        <CheckBox
          tip="Please refresh the page"
          text="On-off auto mode"
          checked={state.autoMode}
          onChange={(checked) => {
            dispatch({ type: ExtensionEvent.ToggleAutoMode, payload: checked });
          }}
        />
      </MenuItem>
      <MenuItem icon={<FilterIcon className={state.kanjiFilter ? 'text-primary' : ''} />}>
        <CheckBox
          tip="Default level is N5"
          text="On-off kanji filter"
          checked={state.kanjiFilter}
          onChange={(checked) => {
            dispatch({ type: ExtensionEvent.ToggleKanjiFilter, payload: checked });
          }}
        />
      </MenuItem>
      <MenuItem icon={<EyeIcon />}>
        <Select
          selected={state.displayMode}
          options={displayModeOptions}
          onChange={(selected) => {
            dispatch({
              type: ExtensionEvent.SwitchDisplayMode,
              payload: selected as DisplayMode,
            });
          }}
        />
      </MenuItem>
      <MenuItem icon={<HiraganaIcon />}>
        <Select
          selected={state.furiganaType}
          options={furiganaTypeOptions}
          onChange={(selected) => {
            dispatch({
              type: ExtensionEvent.SwitchFuriganaType,
              payload: selected as FuriganaType,
            });
          }}
        />
      </MenuItem>
      <MenuItem icon={<CursorTextIcon />}>
        <Select
          tip="Try copying Japanese text"
          selected={state.selectMode}
          options={selectModeOptions}
          onChange={(selected) => {
            dispatch({
              type: ExtensionEvent.SwitchSelectMode,
              payload: selected as SelectMode,
            });
          }}
        />
      </MenuItem>
      <MenuItem icon={<FontSizeIcon />}>
        <RangeSlider
          value={state.fontSize}
          min={50}
          max={100}
          step={1}
          label="Adjust furigana font size"
          onChange={(value) => {
            dispatch({ type: ExtensionEvent.AdjustFontSize, payload: value });
          }}
        />
      </MenuItem>
      <MenuItem icon={<ColorPickerIcon />}>
        <ColorPicker
          color={state.fontColor}
          onChange={(color) => {
            dispatch({ type: ExtensionEvent.AdjustFontColor, payload: color });
          }}
        />
      </MenuItem>
      <MenuItem icon={<SettingIcon />}>
        <Link tip="Open the options page" href="options.html" text="Edit rules" />
      </MenuItem>
      <MenuItem icon={<GithubIcon />}>
        <Link
          tip="Open an issue on GitHub"
          href="https://github.com/aiktb/FuriganaMaker/issues"
          text="Feedback"
        />
      </MenuItem>
      <MenuItem icon={<HeartIcon />}>
        <Link tip="Buy me a coffee☕" href="https://www.buymeacoffee.com/aiktb" text="Sponsor" />
      </MenuItem>
      <MenuItem icon={<ShareIcon />}>
        <SharedCard />
      </MenuItem>
    </menu>
  );
}
