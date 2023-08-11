<script setup lang="ts">
import { onMounted, reactive } from 'vue'

import { Storage } from '@plasmohq/storage'

import { defaultConfig, Event } from '~util/core'
import type { ChangeEvent, Config } from '~util/core'

const option = reactive(defaultConfig)

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

const resetColor = (event: Event.FuriganaColor | Event.OriginalColor) => {
  option[event] = 'currentColor'
  changeEvent(event)
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
      <label>Custom select</label>
      <button @click="customEvent">select</button>
    </div>
    <div class="menu-item">
      <label>Furigana Type</label>
      <select
        v-model="option.FuriganaType"
        @change="changeEvent(Event.FuriganaType)">
        <option value="hiragana">Hiragana</option>
        <option value="katakana">Katakana</option>
        <option value="romaji">Romaji</option>
      </select>
    </div>
    <div class="menu-item">
      <label>Furigana Select</label>
      <select
        v-model="option.SelectMode"
        @change="changeEvent(Event.SelectMode)">
        <option value="original">Original</option>
        <option value="furigana">Furigana</option>
        <option value="all">All</option>
      </select>
    </div>
    <div class="menu-item">
      <label>Choose color for furigana</label>
      <button @click="resetColor(Event.FuriganaColor)">default</button>
      <!-- prettier-ignore -->
      <input type="color" v-model="option.FuriganaColor" @change="changeEvent(Event.FuriganaColor)" />
    </div>
    <div class="menu-item">
      <label>Choose color for original</label>
      <button @click="resetColor(Event.OriginalColor)">default</button>
      <!-- prettier-ignore -->
      <input type="color" v-model="option.OriginalColor" @change="changeEvent(Event.OriginalColor)" />
    </div>
    <div class="menu-item">
      <label>Display</label>
      <select v-model="option.Display" @change="changeEvent(Event.Display)">
        <option value="on">On</option>
        <option value="off">Off</option>
      </select>
    </div>
    <div class="menu-item">
      <label>Font size</label>
      <!-- prettier-ignore -->
      <input type="range" min="50" max="100" v-model="option.Fontsize" @change="changeEvent(Event.Fontsize)" />
    </div>
  </div>
</template>

<style scoped>
.container {
  font-size: small;
}
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #eaeaea;
  width: 15rem;
}
</style>
