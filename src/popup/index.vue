<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, reactive } from 'vue'

import { Storage } from '@plasmohq/storage'

import { defaultConfig, Event } from '~util/core'
import type { ChangeEvent, Config } from '~util/core'

const option = reactive(defaultConfig)
const colorList = ['#000000', '#ffffff', '#ffebcd']

const changeEvent = async (event: ChangeEvent) => {
  const value = option[event]
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

const resetColor = () => {
  option[Event.FuriganaColor] = 'currentColor'
  changeEvent(Event.FuriganaColor)
}

const furiganaColor = computed({
  get() {
    return option[Event.FuriganaColor] === 'currentColor'
      ? '#1070ff'
      : option[Event.FuriganaColor]
  },
  set(newColor: string) {
    option[Event.FuriganaColor] = newColor
  }
})

const setColor = (color: string) => {
  option[Event.FuriganaColor] = color
  changeEvent(Event.FuriganaColor)
}

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
</script>

<template>
  <div class="container">
    <div class="menu-item">
      <Icon icon="basil:cursor-outline" />
      <div
        @click="customEvent"
        id="custom"
        class="content"
        tabindex="1"
        @keyup.enter="customEvent">
        Add furigana
      </div>
    </div>
    <div class="menu-item">
      <Icon
        icon="fluent:power-24-filled"
        :class="{ 'power-on': option[Event.Display] }" />
      <div
        @click="switchPower"
        id="power-on"
        class="content"
        tabindex="0"
        @keyup.enter="switchPower">
        On-off extension
      </div>
    </div>
    <div class="menu-item">
      <Icon icon="mdi:syllabary-hiragana" />
      <select
        class="select cursor"
        v-model="option.FuriganaType"
        @change="changeEvent(Event.FuriganaType)">
        <option value="hiragana">Hiragana</option>
        <option value="katakana">Katakana</option>
        <option value="romaji">Romaji</option>
      </select>
    </div>
    <div class="menu-item">
      <Icon icon="ph:cursor-text-bold" />
      <select
        class="select cursor"
        v-model="option.SelectMode"
        @change="changeEvent(Event.SelectMode)">
        <option value="original">Original</option>
        <option value="furigana">Furigana</option>
        <option value="all">All</option>
      </select>
    </div>
    <div class="menu-item">
      <Icon icon="mingcute:font-size-line" />
      <div id="range">
        <input
          type="range"
          min="50"
          max="100"
          v-model="option.Fontsize"
          @change="changeEvent(Event.Fontsize)" />
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
          :style="'background-color:' + color" />
        <input
          type="color"
          v-model="furiganaColor"
          @change="changeEvent(Event.FuriganaColor)"
          id="color-picker" />
        <Icon
          icon="eva:refresh-fill"
          id="reset-color"
          class="cursor"
          tabindex="0"
          @click="resetColor" />
      </div>
    </div>
    <div class="menu-item">
      <Icon icon="material-symbols:feedback-outline-rounded" />
      <a
        href="https://github.com/aiktb/FuriganaMaker/issues"
        target="_blank"
        class="content"
        id="feedback">
        Feedback
        <Icon icon="ci:link" id="link-icon" />
      </a>
    </div>
  </div>
</template>

<style>
* {
  padding: 0;
  margin: 0;
  font-weight: bold;
  font-size: 13px;
  font-family:
    'JetBrains Mono',
    Roboto,
    Helvetica Neue Light,
    Helvetica Neue,
    Helvetica,
    Arial,
    Lucida Grande,
    sans-serif;
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

.container {
  user-select: none;
  padding: 1rem 1rem;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.5rem;
}

.iconify {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

.content {
  line-height: 24px;
  box-sizing: border-box;
  height: 24px;
  text-align: left;
  background-color: transparent;
  border: none;
  flex: 1;
  background-color: #fff0;
  transition: all 120ms;
  border-radius: 5px;
  margin: none;
  cursor: pointer;
  padding: 0 8px;
}

.content:hover {
  background-color: #e1e1e1;
}

.select {
  line-height: 24px;
  box-sizing: border-box;
  height: 24px;
  text-align: left;
  background-color: transparent;
  border: none;
  flex: 1;
  background-color: #fff0;
  transition: all 120ms;
  border-radius: 5px;
  margin: none;
  cursor: pointer;
  padding-left: 4px;
  padding-right: 8px;
}

.select:hover {
  background-color: #e1e1e1;
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

#reset-color:hover {
  border: none;
  background-color: #e1e1e1;
}

#feedback {
  color: currentColor;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.cursor {
  cursor: pointer;
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
  margin-top: -0.4rem;
  background-color: #1070ff;
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

.power-on {
  color: #1070ff;
}

#feedback:hover {
  color: #1070ff;
}

#feedback:focus {
  color: #1070ff;
}

#link-icon {
  width: 13px;
  height: 13px;
  line-height: 24px;
  margin-left: 4px;
}
</style>
