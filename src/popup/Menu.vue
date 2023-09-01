<script setup lang="ts">
import { reactive } from 'vue'

import Button from '@Components/Button.vue'
import ColorPicker from '@Components/ColorPicker.vue'
import Link from '@Components/Link.vue'
import RangeInput from '@Components/RangeInput.vue'
import Select from '@Components/Select.vue'

import ColorPickerIcon from 'data-text:@Icons/ColorPicker.svg'
import CursorOutlineIcon from 'data-text:@Icons/CursorOutline.svg'
import CursorTextIcon from 'data-text:@Icons/CursorText.svg'
import EyeIcon from 'data-text:@Icons/Eye.svg'
import EyeOffIcon from 'data-text:@Icons/EyeOff.svg'
import FeedbackIcon from 'data-text:@Icons/Feedback.svg'
import FontSizeIcon from 'data-text:@Icons/FontSize.svg'
import HiraganaIcon from 'data-text:@Icons/Hiragana.svg'
import PowerIcon from 'data-text:@Icons/Power.svg'

import { Storage } from '@plasmohq/storage'

import { CustomEvent, type Config } from '~contents/core'
import type { ChangeEvent } from '~contents/core'
import MenuItem from '~popup/MenuItem.vue'

const storage = new Storage({ area: 'local' })
// Top-level await makes this component asynchronous.
// Vue3 doc: Not recommended to use the generic argument of reactive().
const option: Config = reactive({
  display: await storage.get(CustomEvent.Display),
  hover: await storage.get(CustomEvent.Hover),
  furigana: await storage.get(CustomEvent.Furigana),
  select: await storage.get(CustomEvent.Select),
  fontsize: await storage.get(CustomEvent.Fontsize),
  color: await storage.get(CustomEvent.Color)
})

const changeEvent = async (event: ChangeEvent) => {
  const value = option[event]
  await storage.set(event, value)
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: 'https://*/*'
  })
  for (const tab of tabs) {
    await chrome.tabs.sendMessage(tab.id!, event)
  }
}

const customEvent = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  for (const tab of tabs) {
    await chrome.tabs.sendMessage(tab.id!, CustomEvent.Custom)
  }
}

const switchPower = () => {
  option.display = !option.display
  changeEvent(CustomEvent.Display)
}

const switchHoverMode = () => {
  option.hover = !option.hover
  changeEvent(CustomEvent.Hover)
}
</script>

<template>
  <div class="menu">
    <MenuItem tip first>
      <template #icon>
        <div v-html="CursorOutlineIcon" />
      </template>
      <template #content>
        <Button @pointerup="customEvent" @keyup.enter="customEvent">
          Add furigana
        </Button>
      </template>
      <template #tip> Press ESC to cancel </template>
    </MenuItem>
    <MenuItem :shiny="option.display">
      <template #icon>
        <div v-html="PowerIcon" />
      </template>
      <template #content>
        <Button @pointerup="switchPower" @keyup.enter="switchPower">
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
        <Button @pointerup="switchHoverMode" @keyup.enter="switchHoverMode">
          Hover mode
        </Button>
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="HiraganaIcon" />
      </template>
      <template #content>
        <Select
          :options="['hiragana', 'katakana', 'romaji']"
          v-model="option.furigana"
          @change="changeEvent(CustomEvent.Furigana)"
        />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="CursorTextIcon" />
      </template>
      <template #content>
        <Select
          :options="['original', 'furigana', 'all']"
          v-model="option.select"
          @change="changeEvent(CustomEvent.Select)"
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
          @change="changeEvent(CustomEvent.Fontsize)"
        />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="ColorPickerIcon" />
      </template>
      <template #content>
        <ColorPicker
          v-model="option.color"
          @change="changeEvent(CustomEvent.Color)"
        />
      </template>
    </MenuItem>
    <MenuItem tip>
      <template #icon>
        <div v-html="FeedbackIcon" />
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
