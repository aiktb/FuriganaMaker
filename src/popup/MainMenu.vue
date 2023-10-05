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

import { ExtensionEvent, type Config } from '~contents/core'

import BaseButton from './components/BaseButton.vue'
import BaseLink from './components/BaseLink.vue'
import ColorButton from './components/ColorButton.vue'
import RangeInput from './components/RangeInput.vue'
import SelectButton from './components/SelectButton.vue'
import MenuItem from './MenuItem.vue'

const storage = new Storage({ area: 'local' })
// Top-level await makes this component asynchronous.
const option: Config = reactive({
  display: await storage.get(ExtensionEvent.Display),
  hover: await storage.get(ExtensionEvent.Hover),
  furigana: await storage.get(ExtensionEvent.Furigana),
  select: await storage.get(ExtensionEvent.Select),
  fontsize: await storage.get(ExtensionEvent.Fontsize),
  color: await storage.get(ExtensionEvent.Color)
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
    await Browser.tabs.sendMessage(id, ExtensionEvent.Custom)
  }
}

const change = async (event: ExtensionEvent) => {
  const value = option[event]
  await storage.set(event, value)
  const tabs = await Browser.tabs.query({ url: 'https://*/*' })
  for (const tab of tabs) {
    await Browser.tabs.sendMessage(tab.id!, event)
  }
}

const furiganaOptions = ['hiragana', 'katakana', 'romaji']
const selectOptions = ['original', 'furigana']
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
          @change="change(ExtensionEvent.Display)"
        >
          On-off extension
        </BaseButton>
      </template>
    </MenuItem>
    <MenuItem :shiny="option.hover">
      <template #icon>
        <div v-if="option.hover" v-html="EyeIcon" />
        <div v-else v-html="EyeOffIcon" />
      </template>
      <template #content>
        <BaseButton
          v-model="option.hover"
          @change="change(ExtensionEvent.Hover)"
        >
          On-off hover
        </BaseButton>
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="HiraganaIcon" />
      </template>
      <template #content>
        <SelectButton
          v-model="option.furigana"
          :options="furiganaOptions"
          @change="change(ExtensionEvent.Furigana)"
        />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="CursorTextIcon" />
      </template>
      <template #content>
        <SelectButton
          v-model="option.select"
          :options="selectOptions"
          @change="change(ExtensionEvent.Select)"
        />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="ColorPickerIcon" />
      </template>
      <template #content>
        <ColorButton
          v-model="option.color"
          @change="change(ExtensionEvent.Color)"
        />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="FontSizeIcon" />
      </template>
      <template #content>
        <RangeInput
          v-model="option.fontsize"
          :min="50"
          :max="100"
          @change="change(ExtensionEvent.Fontsize)"
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
