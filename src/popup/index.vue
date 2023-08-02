<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

import { Storage } from '@plasmohq/storage'

import { Change } from '~contents/core'
import type { Furigana, Select } from '~contents/core'

const furigana: Ref<Furigana> = ref('katakana')
const furiganaChange = () => {
  const storage = new Storage()
  storage.set(Change.Furigana, furigana.value as Furigana)
}

const select: Ref<Select> = ref('off')
const selectChange = () => {
  const storage = new Storage()
  storage.set(Change.Select, select.value as Select)
  chrome.tabs.query({ url: 'https://twitter.com/*' }).then((tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id!, {
        type: Change.Select,
        value: select.value
      })
    })
  })
}

onMounted(() => {
  const storage = new Storage()
  storage.get(Change.Furigana).then((data) => {
    furigana.value = data as Furigana
  })
  storage.get(Change.Select).then((data) => {
    select.value = data as Select
  })
})
</script>

<template>
  <div class="container">
    <div class="menu-item">
      <span>Furigana Type:</span>
      <select v-model="furigana" @change="furiganaChange">
        <option value="katakana">Katakana</option>
        <option value="hiragana">Hiragana</option>
        <option value="romaji">Romaji</option>
      </select>
    </div>
    <div class="menu-item">
      <span>Furigana Select</span>
      <select v-model="select" @change="selectChange">
        <option value="on">On</option>
        <option value="off">Off</option>
      </select>
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
