<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import { ref } from 'vue'

import { MenuEvent } from '~contents/core'

const main = ref<HTMLElement | null>(null)
const { style } = useDraggable(main)

const display = ref(true)
window.addEventListener('message', (event: MessageEvent<MenuEvent>) => {
  switch (event.data) {
    case MenuEvent.Open:
      display.value = true
      break
    case MenuEvent.Close:
      display.value = false
      break
  }
})
</script>

<template>
  <div class="main" ref="main" v-if="display" :style="style" tabindex="0" />
</template>

<style scoped>
.main {
  display: flex;
  width: 200px;
  height: 150px;
  background-color: #1c2732;
  box-shadow: 0 0 10px 3px rgba(162, 161, 161, 0.3);
  position: fixed;
  z-index: 999;
  border-radius: 5px;
}
</style>
