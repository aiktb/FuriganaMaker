<script setup lang="ts">
import { onMounted, reactive } from 'vue'

import { Storage } from '@plasmohq/storage'

import { Change } from '~contents/core'
import type {
  Color,
  Display,
  Engine,
  Fontsize,
  Furigana,
  Select
} from '~contents/core'

type Option = {
  furigana: Furigana
  select: Select
  color: Color
  display: Display
  engine: Engine
  fontsize: Fontsize
}

const option: Option = reactive({
  furigana: 'hiragana',
  select: 'on',
  color: 'currentColor',
  display: 'on',
  engine: 'network',
  fontsize: 50
})

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
  let data = await storage.get(Change.Furigana)
  option.furigana = data as Furigana
  data = await storage.get(Change.Select)
  option.select = data as Select
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
        <option value="on">On</option>
        <option value="off">Off</option>
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
