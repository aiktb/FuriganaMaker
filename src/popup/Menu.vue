<script setup lang="ts">
import { detect } from 'detect-browser'
import { reactive } from 'vue'
import Browser from 'webextension-polyfill'

import Button from '@Components/Button.vue'
import ColorButton from '@Components/ColorButton.vue'
import Link from '@Components/Link.vue'
import RangeInput from '@Components/RangeInput.vue'
import SelectButton from '@Components/SelectButton.vue'

import ColorPickerIcon from 'data-text:@Icons/ColorPicker.svg'
import CursorOutlineIcon from 'data-text:@Icons/CursorOutline.svg'
import CursorTextIcon from 'data-text:@Icons/CursorText.svg'
import EyeIcon from 'data-text:@Icons/Eye.svg'
import EyeOffIcon from 'data-text:@Icons/EyeOff.svg'
import FontSizeIcon from 'data-text:@Icons/FontSize.svg'
import GithubIcon from 'data-text:@Icons/Github.svg'
import HiraganaIcon from 'data-text:@Icons/Hiragana.svg'
import PowerIcon from 'data-text:@Icons/Power.svg'

import { Storage } from '@plasmohq/storage'

import { ExtensionEvent, type Config } from '~contents/core'
import MenuItem from '~popup/MenuItem.vue'

const storage = new Storage({ area: 'local' })
// Top-level await makes this component asynchronous.
// Vue3 doc: Not recommended to use the generic argument of reactive().
const option: Config = reactive({
  display: await storage.get(ExtensionEvent.Display),
  hover: await storage.get(ExtensionEvent.Hover),
  furigana: await storage.get(ExtensionEvent.Furigana),
  select: await storage.get(ExtensionEvent.Select),
  fontsize: await storage.get(ExtensionEvent.Fontsize),
  color: await storage.get(ExtensionEvent.Color)
})

const change = async (event: ExtensionEvent) => {
  if (event !== ExtensionEvent.Custom) {
    await storage.set(event, option[event])
  }
  // 'url' parameter requires 'tabs' or 'activeTab' permission.
  // `chrome.tabs.query` is not compatible with firefox.
  const tabs = await Browser.tabs.query({ url: 'https://*/*' })
  for (const tab of tabs) {
    await Browser.tabs.sendMessage(tab.id!, event)
  }
}

const furiganaOptions = ['hiragana', 'katakana', 'romaji']
const selectOptions = ['original', 'furigana']
// The copy behavior of the ruby tag in Firefox and Chrome is very different when selected.
// It is very difficult to implement 'all' mode in Firefox.
const isFirefox = detect()?.name === 'firefox'
if (!isFirefox) {
  selectOptions.push('all')
}
</script>

<template>
  <div class="menu">
    <MenuItem tip>
      <template #icon>
        <div v-html="CursorOutlineIcon" />
      </template>
      <template #content>
        <Button @click="change(ExtensionEvent.Custom)"> Add furigana </Button>
      </template>
      <template #tip> Press ESC to cancel </template>
    </MenuItem>
    <MenuItem :shiny="option.display">
      <template #icon>
        <div v-html="PowerIcon" />
      </template>
      <template #content>
        <Button
          v-model="option.display"
          @change="change(ExtensionEvent.Display)"
        >
          On-off extension
        </Button>
      </template>
    </MenuItem>
    <MenuItem :shiny="option.hover">
      <template #icon>
        <div v-html="EyeIcon" v-if="option.hover" />
        <div v-html="EyeOffIcon" v-else />
      </template>
      <template #content>
        <Button v-model="option.hover" @change="change(ExtensionEvent.Hover)">
          Hover mode
        </Button>
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="HiraganaIcon" />
      </template>
      <template #content>
        <SelectButton
          :options="furiganaOptions"
          v-model="option.furigana"
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
          :options="selectOptions"
          v-model="option.select"
          @change="change(ExtensionEvent.Select)"
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
        <div v-html="ColorPickerIcon" />
      </template>
      <template #content>
        <ColorButton
          v-model="option.color"
          @change="change(ExtensionEvent.Color)"
        />
      </template>
    </MenuItem>
    <MenuItem tip>
      <template #icon>
        <div v-html="GithubIcon" />
      </template>
      <template #content>
        <Link link="https://github.com/aiktb/FuriganaMaker/issues">
          Feedback
        </Link>
      </template>
      <template #tip> Open an issue on GitHub </template>
    </MenuItem>
  </div>
</template>

<style scoped>
.menu {
  padding: 0 0.5rem;
  width: 13.5rem;
  border-right: 0.15rem solid var(--feature);
}
</style>
