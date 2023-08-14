<script setup lang="ts">
import Button from '@Components/Button.vue'
import Link from '@Components/Link.vue'
import MenuItem from '@Components/MenuItem.vue'
import CursorOutline from 'data-text:@Icons/CursorOutline.svg'
import CursorText from 'data-text:@Icons/CursorText.svg'
import Feedback from 'data-text:@Icons/Feedback.svg'
import Hiragana from 'data-text:@Icons/Hiragana.svg'
import Power from 'data-text:@Icons/Power.svg'
import { computed, onMounted, reactive } from 'vue'

import { Storage } from '@plasmohq/storage'

import { defaultConfig, Event } from '~util/core'
import type { ChangeEvent, Config } from '~util/core'

import Select from './components/Select.vue'

const option = reactive(defaultConfig)
// const colorList = ['#000000', '#ffffff', '#ffebcd']

const changeEvent = async (event: ChangeEvent) => {
  const value = option[event]
  console.log(event, value)
  const storage = new Storage()
  storage.set(event, value)
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  for (const tab of tabs) {
    chrome.tabs.sendMessage(tab.id!, event)
  }
}

const customEvent = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  for (const tab of tabs) {
    chrome.tabs.sendMessage(tab.id!, Event.Custom)
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
        <div v-html="CursorOutline" />
      </template>
      <template #content>
        <Button title="Add furigana" @click="customEvent" />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="Power" :class="powerOn" />
      </template>
      <template #content>
        <Button title="On-off extension" @click="switchPower" />
      </template>
    </MenuItem>
    <MenuItem>
      <template #icon>
        <div v-html="Hiragana" />
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
        <div v-html="CursorText" />
      </template>
      <template #content>
        <Select
          :options="['original', 'furigana', 'all']"
          v-model="option.SelectMode"
          @change="changeEvent(Event.SelectMode)"
        />
      </template>
    </MenuItem>
    <!-- <div class="menu-item">
      <Icon icon="mingcute:font-size-line" />
      <div id="range">
        <input
          type="range"
          min="50"
          max="100"
          v-model="option.Fontsize"
          @change="changeEvent(Event.Fontsize)"
        />
      </div>
    </div>
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
        <div v-html="Feedback" />
      </template>
      <template #content>
        <Link
          title="Feedback"
          link="https://github.com/aiktb/FuriganaMaker/issues"
        />
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

/* .menuItem:not(:last-child) {
  border-bottom: var(--gray) solid 1px;
} */

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

input[type='color'] {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0 0.25rem;
  vertical-align: middle;
  display: inline-block;
  border: 2px solid currentColor;
}

input[type='color']::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type='color']::-webkit-color-swatch {
  border-radius: 50%;
  border: none;
}

.color-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0 auto;
  padding: 0rem 0.25rem;
}

.color-item {
  width: 16px;
  height: 16px;
  display: inline-block;
  border-radius: 5px;
  border: 2px solid currentColor;
  cursor: pointer;
  margin: 0 0.35em;
}

#color {
  box-sizing: border-box;
  text-align: left;
  background-color: transparent;
  border: none;
  flex: 1;
  background-color: #fff0;
  transition: all 120ms;
  border-radius: 5px;
}

#reset-color {
  display: inline;
  justify-content: center;
  align-items: center;
  margin-right: 0;
  border: none;
  border-radius: 50%;
}

#reset-color:focus {
  border: none;
}

#reset-color:hover {
  border: none !important;
  background-color: #e1e1e1;
}

::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  position: relative;
  margin: auto;
  display: block;
  height: 0.25rem;
  border-radius: 22px;
  background-color: #111;
}

::-moz-range-track {
  -moz-appearance: none;
  appearance: none;
  position: relative;
  margin: auto;
  display: block;
  height: 0.35rem;
  border-radius: 22px;
  background-color: #111;
}

::-ms-track {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  position: relative;
  margin: auto;
  display: block;
  height: 0.35rem;
  border-radius: 22px;
  background-color: #111;
}

/* range thumb */

::-webkit-slider-thumb {
  -webkit-appearance: none;
  cursor: pointer;
  margin-top: -0.45rem;
  background-color: #0075ff;
}

::-moz-range-thumb {
  cursor: pointer;
}

::-ms-thumb {
  cursor: pointer;
}

#range {
  padding: 0 8px;
  height: 24px;
}

#range:hover {
  background-color: #e1e1e1;
  border-radius: 5px;
}
</style>
