<template>
  <div>
    <div class="menu-item">
      <select v-model="furiganaType" @change="furiganaTypeChange">
        <option value="romaji">Romaji</option>
        <option value="hiragana">Hiragana</option>
        <option value="katakana">Katakana</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import { Storage } from '@plasmohq/storage'

let furiganaType = ref('katakana')

const furiganaTypeChange = () => {
  const storage = new Storage()
  storage.set('furiganaType', furiganaType.value)
}

onMounted(() => {
  const storage = new Storage()
  storage
    .get('furiganaType')
    .then((data) => {
      furiganaType.value = data
    })
    .catch((_err) => {
      furiganaType.value = 'katakana'
    })
})
</script>
