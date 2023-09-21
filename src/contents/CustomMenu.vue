<script setup lang="ts">
import { useDraggable, useEventListener } from '@vueuse/core'
import { ref } from 'vue'
import Browser from 'webextension-polyfill'

import CloseIcon from 'data-text:@Icons/Close.svg'
import CursorOutlineIcon from 'data-text:@Icons/CursorOutline.svg'
import LeftIcon from 'data-text:@Icons/Left.svg'
import RightIcon from 'data-text:@Icons/Right.svg'
import SettingIcon from 'data-text:@Icons/Setting.svg'

import { MenuEvent } from '~contents/core'

const main = ref<HTMLElement | null>(null)
const drag = ref<HTMLElement | null>(null)
const { style, x, y } = useDraggable(main, {
  handle: drag,
  initialValue: { x: 20, y: 20 }
})

window.addEventListener('message', (event: MessageEvent<MenuEvent>) => {
  switch (event.data) {
    case MenuEvent.Open:
      display.value = true
      break
    case MenuEvent.Close:
      display.value = false
      break
    case MenuEvent.Lock:
      lock.value = true
      break
  }
})

useEventListener(window, 'resize', () => {
  x.value = 20
  y.value = 20
})

const display = ref(false)
const rule = ref(true)
const lock = ref(true)
const level = ref(0)
const similar = ref(false)
</script>

<template>
  <Transition>
    <div id="main" ref="main" v-if="display" :style="style" tabindex="-1">
      <header id="drag" ref="drag">
        <h1 id="title">
          Element selecting
          <span v-html="CursorOutlineIcon" class="icon" id="cursor" />
        </h1>
        <p>Choose elements on the page to add furigana.</p>
        <button
          v-html="CloseIcon"
          class="icon"
          id="close"
          @click="display = false"
        />
      </header>
      <div id="modes">
        <button class="mode" :class="{ checked: !rule }" @click="rule = false">
          Add anywhere
        </button>
        <button class="mode" :class="{ checked: rule }" @click="rule = true">
          Rule edit
        </button>
      </div>
      <div id="edit" v-if="rule">
        <div v-if="lock" id="lock">
          <button
            class="mode"
            id="similar"
            :class="{ checked: similar }"
            @click="similar = !similar"
          >
            Apply similar
          </button>
          <a
            :href="Browser.runtime.getURL('options.html')"
            target="_blank"
            id="advanced"
          >
            Advanced settings
            <span v-html="SettingIcon" class="setting icon" />
          </a>
          <button id="min" class="small">MIN</button>
          <button
            v-html="LeftIcon"
            class="icon small"
            id="subtract"
            @click="level--"
          />
          <span id="level">{{ level }}</span>
          <button
            v-html="RightIcon"
            class="icon small"
            id="add"
            @click="level++"
          />
          <button id="max" class="small">MAX</button>
          <button id="other">Select a different element</button>
          <button id="apply">Apply</button>
        </div>
        <div v-else class="unlock">Please select an element first!</div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
#main {
  --blue: #0075ff;
  --red: #8e2c13;
  --white: #f5f5f5da;
  --black: #1c2732;
  --gray: #343a3f;
}

@font-face {
  font-display: swap;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  src:
    local('Inter'),
    url('../../assets/fonts/inter-v13-latin-700.woff2') format('woff2');
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  border: none;
  background-color: var(--black);
  color: var(--white);
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: bold;
}

button {
  cursor: pointer;
}

button,
a {
  transition: all 250ms;
}

#main {
  position: fixed;
  user-select: none;
  z-index: 2147483647;
  width: 600px;
  outline: 1.5px solid var(--gray);
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  box-shadow: 0 0 10px 3px rgba(162, 161, 161, 0.3);
}

#main > :not(:last-child) {
  border-bottom: 1.5px solid var(--gray);
}

#main > * {
  padding: 15px 15px;
}

.icon {
  display: flex inline;
  align-items: center;
  justify-content: center;
}

.icon > :deep(svg) {
  width: 100%;
  height: 100%;
}

#drag {
  cursor: move;
}

#title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  margin-bottom: 10px;
}

#close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 22px;
  height: 22px;
}

#close:hover,
#close:focus-visible {
  color: var(--blue);
}

#cursor {
  color: var(--blue);
}

#modes {
  display: flex;
  gap: 20px;
}

.mode {
  display: flex;
  align-items: center;
  justify-content: start;
}

.mode:hover,
.mode:focus-visible {
  color: var(--blue);
  text-decoration: underline wavy currentColor;
}

.mode:before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 10px;
  border: 2px solid var(--white);
  border-radius: 50%;
  vertical-align: middle;
  cursor: pointer;
}

.checked {
  text-decoration: underline wavy var(--blue);
}

.checked:before {
  background-color: var(--blue);
  text-decoration-color: var(--blue);
}

#lock {
  display: grid;
  grid-template-columns: repeat(7, 20px) 1fr auto auto;
  grid-template-areas:
    'similar similar similar  similar similar similar similar ... advanced advanced'
    'min     min     subtract level   add     max     max     ... other    apply';
  gap: 15px 5px;
}

#similar {
  grid-area: similar;
}

#advanced {
  grid-area: advanced;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 5px;
}

#advanced:hover {
  color: var(--blue);
}

#advanced:hover > .icon {
  color: var(--blue);
}

.setting {
  width: 25px;
  height: 25px;
}

.small {
  font-size: 13px;
  height: 20px;
  align-self: center;
}

.small:hover {
  background-color: var(--blue);
}

#min {
  grid-area: min;
}

#subtract {
  grid-area: subtract;
}

#level {
  grid-area: level;
  justify-self: center;
  align-self: center;
  border-bottom: 2px solid var(--blue);
  width: 20px;
  text-align: center;
}

#add {
  grid-area: add;
}

#max {
  grid-area: max;
}

#other {
  grid-area: other;
  padding: 5px 8px;
  background-color: var(--blue);
}

#apply {
  grid-area: apply;
  padding: 5px 8px;
  background-color: var(--red);
}

#lock > button:not(#similar) {
  border: 2px solid currentColor;
  border-radius: 5px;
}

#lock > button:not(#similar):hover {
  color: #fff;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
