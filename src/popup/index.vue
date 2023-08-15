<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'

import Button from '@Components/Button.vue'
import Link from '@Components/Link.vue'
import MenuItem from '@Components/MenuItem.vue'
import RangeInput from '@Components/RangeInput.vue'
import Select from '@Components/Select.vue'

import CursorOutlineIcon from 'data-text:@Icons/CursorOutline.svg'
import CursorTextIcon from 'data-text:@Icons/CursorText.svg'
import FeedbackIcon from 'data-text:@Icons/Feedback.svg'
import FontSizeIcon from 'data-text:@Icons/FontSize.svg'
import HiraganaIcon from 'data-text:@Icons/Hiragana.svg'
import PowerIcon from 'data-text:@Icons/Power.svg'

import { Storage } from '@plasmohq/storage'

import { defaultConfig, Event } from '~util/core'
import type { ChangeEvent, Config } from '~util/core'

const option = reactive(defaultConfig)
// const colorList = ['#000000', '#ffffff', '#ffebcd']

const changeEvent = async (event: ChangeEvent) => {
  const value = option[event]
  console.log(event, value)
  const storage = new Storage()
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

// const resetColor = () => {
//   option[Event.FuriganaColor] = 'currentColor'
//   changeEvent(Event.FuriganaColor)
// }

// // 'currentColor' does not conform to the color format,
// // which will cause a warning to be thrown, use the following method to bypass.
// const furiganaColor = computed({
//   get() {
//     return option[Event.FuriganaColor] === 'currentColor'
//       ? '#0075ff'
//       : option[Event.FuriganaColor]
//   },
//   set(newColor: string) {
//     option[Event.FuriganaColor] = newColor
//   }
// })

// const setColor = (color: string) => {
//   option[Event.FuriganaColor] = color
//   changeEvent(Event.FuriganaColor)
// }

const switchPower = () => {
  option[Event.Display] = !option[Event.Display]
  changeEvent(Event.Display)
}

onMounted(async () => {
  const storage = new Storage()
  for (const key in defaultConfig) {
    option[key as keyof Config] = await storage.get(key)
  }
})

const powerOn = computed(() => ({
  powerOn: option[Event.Display]
}))
</script>

<template>
  <div class="menu">
    <MenuItem>
      <template #icon>
        <div v-html="CursorOutlineIcon" />
      </template>
      <template #content>
        <Button @click="customEvent"> Add furigana </Button>
      </template>
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
    <!--
    <div class="menu-item">
      <Icon icon="pepicons-pop:color-picker" />
      <div id="color" class="color-container">
        <div
          class="color-item"
          v-for="color of colorList"
          @click="setColor(color)"
          @keydown.enter="setColor(color)"
          tabindex="0"
          :style="'background-color:' + color"
        />
        <input
          type="color"
          v-model="furiganaColor"
          @change="changeEvent(Event.FuriganaColor)"
          id="color-picker"
        />
        <Icon
          icon="eva:refresh-fill"
          id="reset-color"
          class="cursor"
          tabindex="0"
          @click="resetColor"
        />
      </div>
    </div> -->
    <MenuItem>
      <template #icon>
        <div v-html="FeedbackIcon" />
      </template>
      <template #content>
        <Link link="https://github.com/aiktb/FuriganaMaker/issues">
          Feedback
        </Link>
      </template>
    </MenuItem>
  </div>
</template>

<style>
:root {
  --blue: #0075ff;
  --gray: #e1e1e1;
}

body {
  font-size: 13px;
}

.menu {
  user-select: none;
  padding: 0.5rem 0.5rem;
  width: 13.5rem;
  font-family: 'JetBrains Mono';
  font-weight: bold;
  box-sizing: border-box;
}

.menuItem > div {
  display: flex;
  align-items: center;
}

.menuItem > div > svg {
  width: 1.5rem;
  height: 1.5rem;
}

.powerOn {
  color: var(--blue);
}
</style>
