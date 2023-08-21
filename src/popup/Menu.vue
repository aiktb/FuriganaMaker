<script setup lang="ts">
import { computed, reactive } from 'vue'

import Button from '@Components/Button.vue'
import ColorPicker from '@Components/ColorPicker.vue'
import Link from '@Components/Link.vue'
import RangeInput from '@Components/RangeInput.vue'
import Select from '@Components/Select.vue'

import ColorPickerIcon from 'data-text:@Icons/ColorPicker.svg'
import CursorOutlineIcon from 'data-text:@Icons/CursorOutline.svg'
import CursorTextIcon from 'data-text:@Icons/CursorText.svg'
import FeedbackIcon from 'data-text:@Icons/Feedback.svg'
import FontSizeIcon from 'data-text:@Icons/FontSize.svg'
import HiraganaIcon from 'data-text:@Icons/Hiragana.svg'
import PowerIcon from 'data-text:@Icons/Power.svg'

import { Storage } from '@plasmohq/storage'

import MenuItem from '~popup/MenuItem.vue'
import { Event, type Config } from '~util/core'
import type { ChangeEvent } from '~util/core'

/* The data loading must be completed before the beforeMount life cycle, 
  otherwise the child component will get the wrong defaultConfig.
  Top-level await makes this component asynchronous. */
const storage = new Storage({ area: 'local' })
const option = reactive<Config>({
  FuriganaType: await storage.get('FuriganaType'),
  SelectMode: await storage.get('SelectMode'),
  Display: await storage.get('Display'),
  Fontsize: await storage.get('Fontsize'),
  FuriganaColor: await storage.get('FuriganaColor')
})

const changeEvent = async (event: ChangeEvent) => {
  const value = option[event]
  await storage.set(event, value)
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  for (const tab of tabs) {
    await chrome.tabs.sendMessage(tab.id!, event)
  }
}

const customEvent = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  for (const tab of tabs) {
    await chrome.tabs.sendMessage(tab.id!, Event.Custom)
  }
}

const switchPower = () => {
  option[Event.Display] = !option[Event.Display]
  changeEvent(Event.Display)
}

const powerOn = computed(() => ({
  powerOn: option[Event.Display]
}))
</script>

<template>
  <div class="menu">
    <MenuItem :tip="true">
      <template #icon>
        <div v-html="CursorOutlineIcon" />
      </template>
      <template #content>
        <Button @click="customEvent"> Add furigana </Button>
      </template>
      <template #tip> Press ESC to cancel </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="PowerIcon" :class="powerOn" />
      </template>
      <template #content>
        <Button @click="switchPower"> On-off extension </Button>
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="HiraganaIcon" />
      </template>
      <template #content>
        <Select
          :options="['hiragana', 'katakana', 'romaji']"
          v-model="option.FuriganaType"
          @change="changeEvent(Event.FuriganaType)"
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
          v-model="option.SelectMode"
          @change="changeEvent(Event.SelectMode)"
        />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="FontSizeIcon" />
      </template>
      <template #content>
        <RangeInput
          v-model="option.Fontsize"
          :min="50"
          :max="100"
          @change="changeEvent(Event.Fontsize)"
        />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="ColorPickerIcon" />
      </template>
      <template #content>
        <ColorPicker
          v-model="option.FuriganaColor"
          @change="changeEvent(Event.FuriganaColor)"
        />
      </template>
    </MenuItem>
    <MenuItem :tip="true">
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

<style>
.menu {
  user-select: none;
  padding: 0 0.5rem;
  width: 13.5rem;
  font-family: 'JetBrains Mono';
  font-weight: bold;
  box-sizing: border-box;
  border-right: 0.15rem solid var(--feature);
}

.powerOn {
  color: var(--feature);
}

.menuItem:first-child > .tip {
  bottom: -1.5rem !important;
  left: 2rem;
}
</style>
