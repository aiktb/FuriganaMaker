<script setup lang="ts">
import { onMounted, reactive } from 'vue'

import { Storage } from '@plasmohq/storage'

import { Change, defaultValue } from '~contents/core'

const option = reactive(defaultValue)

const changeEvent = async (type: Change) => {
  const value = option[type]
  const storage = new Storage()
  storage.set(type, value)
  const tabs = await chrome.tabs.query({ url: 'https://twitter.com/*' })
  for (const tab of tabs) {
    chrome.tabs.sendMessage(tab.id!, { type, value })
  }
}

const resetColor = () => {
  option.color = 'currentColor'
  changeEvent(Change.Color)
}

onMounted(async () => {
  const storage = new Storage()
  option.furigana = await storage.get(Change.Furigana)
  option.select = await storage.get(Change.Select)
  option.color = await storage.get(Change.Color)
  option.display = await storage.get(Change.Display)
  option.fontsize = await storage.get(Change.Fontsize)
  option.engine = await storage.get(Change.Engine)
})
</script>

<template>
  <div class="container">
    <div class="menu-item">
      <label>Furigana Type</label>
      <select v-model="option.furigana" @change="changeEvent(Change.Furigana)">
        <option value="hiragana">Hiragana</option>
        <option value="katakana">Katakana</option>
        <option value="romaji">Romaji</option>
      </select>
    </div>
    <div class="menu-item">
      <label>Furigana Select</label>
      <select v-model="option.select" @change="changeEvent(Change.Select)">
        <option value="original">Original</option>
        <option value="furigana">Furigana</option>
        <option value="all">All</option>
      </select>
    </div>
    <div class="menu-item">
      <label>Choose a color</label>
      <button @click="resetColor">default</button>
      <!-- prettier-ignore -->
      <input type="color" v-model="option.color" @change="changeEvent(Change.Color)" />
    </div>
    <div class="menu-item">
      <label>Display</label>
      <select v-model="option.display" @change="changeEvent(Change.Display)">
        <option value="on">On</option>
        <option value="off">Off</option>
      </select>
    </div>
    <div class="menu-item">
      <label>Font size</label>
      <!-- prettier-ignore -->
      <input type="range" min="50" max="100"
      v-model="option.fontsize" @change="changeEvent(Change.Fontsize)">
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
