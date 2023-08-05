<script setup lang="ts">
import { onMounted, reactive } from 'vue'

import { Storage } from '@plasmohq/storage'

import { defaultConfig, Event } from '~contents/core'

const option = reactive(defaultConfig)

// prettier-ignore
type ChangeEvent = Event.Color | Event.Display | Event.Fontsize | Event.Furigana | Event.Select

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
  option.color = 'currentColor'
  changeEvent(Event.Color)
}

onMounted(async () => {
  const storage = new Storage()
  option.furigana = await storage.get(Event.Furigana)
  option.select = await storage.get(Event.Select)
  option.color = await storage.get(Event.Color)
  option.display = await storage.get(Event.Display)
  option.fontsize = await storage.get(Event.Fontsize)
  option.engine = await storage.get(Event.Engine)
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
      <select v-model="option.furigana" @change="changeEvent(Event.Furigana)">
        <option value="hiragana">Hiragana</option>
        <option value="katakana">Katakana</option>
        <option value="romaji">Romaji</option>
      </select>
    </div>
    <div class="menu-item">
      <label>Furigana Select</label>
      <select v-model="option.select" @change="changeEvent(Event.Select)">
        <option value="original">Original</option>
        <option value="furigana">Furigana</option>
        <option value="all">All</option>
      </select>
    </div>
    <div class="menu-item">
      <label>Choose a color</label>
      <button @click="resetColor">default</button>
      <!-- prettier-ignore -->
      <input type="color" v-model="option.color" @change="changeEvent(Event.Color)" />
    </div>
    <div class="menu-item">
      <label>Display</label>
      <select v-model="option.display" @change="changeEvent(Event.Display)">
        <option value="on">On</option>
        <option value="off">Off</option>
      </select>
    </div>
    <div class="menu-item">
      <label>Font size</label>
      <!-- prettier-ignore -->
      <input type="range" min="50" max="100" v-model="option.fontsize" @change="changeEvent(Event.Fontsize)" />
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
