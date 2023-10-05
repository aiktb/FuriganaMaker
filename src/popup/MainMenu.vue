<script setup lang="ts">
import { reactive } from 'vue'
import Browser from 'webextension-polyfill'

import ColorPickerIcon from 'data-text:@Icons/ColorPicker.svg'
import CursorOutlineIcon from 'data-text:@Icons/CursorOutline.svg'
import CursorTextIcon from 'data-text:@Icons/CursorText.svg'
import EyeIcon from 'data-text:@Icons/Eye.svg'
import EyeOffIcon from 'data-text:@Icons/EyeOff.svg'
import FontSizeIcon from 'data-text:@Icons/FontSize.svg'
import GithubIcon from 'data-text:@Icons/Github.svg'
import HiraganaIcon from 'data-text:@Icons/Hiragana.svg'
import PowerIcon from 'data-text:@Icons/Power.svg'
import SettingIcon from 'data-text:@Icons/Setting.svg'

import { Storage } from '@plasmohq/storage'

import {
  ExtensionEvent,
  ExtensionStorage,
  FuriganaType,
  SelectMode,
  StorageChangeEvent,
  toStorageKey,
  type Config
} from '~contents/core'

import BaseButton from './components/BaseButton.vue'
import BaseLink from './components/BaseLink.vue'
import ColorButton from './components/ColorButton.vue'
import RangeInput from './components/RangeInput.vue'
import SelectButton from './components/SelectButton.vue'
import MenuItem from './MenuItem.vue'

const storage = new Storage({ area: 'local' })
// Top-level await makes this component asynchronous.
const option: Config = reactive({
  display: await storage.get(ExtensionStorage.Display),
  hoverMode: await storage.get(ExtensionStorage.HoverMode),
  furiganaType: await storage.get(ExtensionStorage.FuriganaType),
  selectMode: await storage.get(ExtensionStorage.SelectMode),
  fontSize: await storage.get(ExtensionStorage.FontSize),
  fontColor: await storage.get(ExtensionStorage.FontColor)
})

const addFurigana = async () => {
  // `chrome.tabs.query` is not compatible with firefox.
  // 'url' parameter requires 'tabs' or 'activeTab' permission.
  const tabs = await Browser.tabs.query({
    active: true,
    currentWindow: true,
    url: 'https://*/*'
  })
  const id = tabs[0]?.id
  if (id) {
    await Browser.tabs.sendMessage(id, ExtensionEvent.AddFurigana)
  }
}
const change = async (event: StorageChangeEvent) => {
  const key = toStorageKey(event)
  const value = option[key]
  await storage.set(key, value)
  const tabs = await Browser.tabs.query({ url: 'https://*/*' })
  for (const tab of tabs) {
    await Browser.tabs.sendMessage(tab.id!, event)
  }
}

// prettier-ignore
const furiganaOptions = [FuriganaType.Hiragana, FuriganaType.Katakana, FuriganaType.Romaji ]
const selectOptions = [SelectMode.Original, SelectMode.Furigana]
</script>

<template>
  <menu>
    <MenuItem tip>
      <template #icon>
        <div v-html="CursorOutlineIcon" />
      </template>
      <template #content>
        <BaseButton @click="addFurigana"> Add furigana </BaseButton>
      </template>
      <template #tip> Press <kbd>ESC</kbd> to cancel </template>
    </MenuItem>
    <MenuItem :shiny="option.display">
      <template #icon>
        <div v-html="PowerIcon" />
      </template>
      <template #content>
        <BaseButton
          v-model="option.display"
          @change="change(ExtensionEvent.ToggleDisplay)"
        >
          On-off extension
        </BaseButton>
      </template>
    </MenuItem>
    <MenuItem :shiny="option.hoverMode">
      <template #icon>
        <div v-if="option.hover" v-html="EyeIcon" />
        <div v-else v-html="EyeOffIcon" />
      </template>
      <template #content>
        <BaseButton
          v-model="option.hoverMode"
          @change="change(ExtensionEvent.ToggleHoverMode)"
        >
          On-off hover mode
        </BaseButton>
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="HiraganaIcon" />
      </template>
      <template #content>
        <SelectButton
          v-model="option.furiganaType"
          :options="furiganaOptions"
          @change="change(ExtensionEvent.SwitchFuriganaType)"
        />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="CursorTextIcon" />
      </template>
      <template #content>
        <SelectButton
          v-model="option.selectMode"
          :options="selectOptions"
          @change="change(ExtensionEvent.SwitchSelectMode)"
        />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="ColorPickerIcon" />
      </template>
      <template #content>
        <ColorButton
          v-model="option.fontColor"
          @change="change(ExtensionEvent.AdjustFontColor)"
        />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="FontSizeIcon" />
      </template>
      <template #content>
        <RangeInput
          v-model="option.fontSize"
          :min="50"
          :max="100"
          @change="change(ExtensionEvent.AdjustFontSize)"
        />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="SettingIcon" />
      </template>
      <template #content>
        <BaseLink link="options.html"> Edit rules </BaseLink>
      </template>
    </MenuItem>
    <MenuItem tip>
      <template #icon>
        <div v-html="GithubIcon" />
      </template>
      <template #content>
        <BaseLink link="https://github.com/aiktb/FuriganaMaker/issues">
          Feedback
        </BaseLink>
      </template>
      <template #tip> Open an issue on GitHub </template>
    </MenuItem>
  </menu>
</template>

<style scoped>
menu {
  padding: 0 0.5rem;
  width: 13.5rem;
  border-right: 0.15rem solid var(--feature);
}
</style>
