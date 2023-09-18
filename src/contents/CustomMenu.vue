<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import { Ref, ref } from 'vue'

import CloseIcon from 'data-text:@Icons/Close.svg'
import CursorOutlineIcon from 'data-text:@Icons/CursorOutline.svg'
import LeftIcon from 'data-text:@Icons/Left.svg'
import RightIcon from 'data-text:@Icons/Right.svg'
import SettingIcon from 'data-text:@Icons/Setting.svg'

import { MenuEvent } from '~contents/core'

const main = ref<HTMLElement | null>(null)
const dragArea = ref<HTMLElement | null>(null)
const { style } = useDraggable(main, {
  handle: dragArea,
  initialValue: { x: window.innerWidth - 630, y: 20 }
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
const display = ref(true)
const mode: Ref<'anywhere' | 'rule'> = ref('rule')
const lock = ref(true)
const level = ref(0)
const similar = ref(false)
</script>

<template>
  <Transition>
    <div class="main" ref="main" v-if="display" :style="style" tabindex="-1">
      <button v-html="CloseIcon" class="close" @click="display = false" />
      <div class="dragArea" ref="dragArea">
        <h1>
          Element selecting
          <span v-html="CursorOutlineIcon" class="cursorOutlineIcon" />
        </h1>
        <p>Choose elements on the page to add furigana.</p>
      </div>
      <div class="mode">
        <input type="radio" id="anywhere" v-model="mode" value="anywhere" />
        <label for="anywhere" tabindex="0">Add anywhere</label>
        <input type="radio" id="rule" v-model="mode" value="rule" />
        <label for="rule" tabindex="0">Rule edit</label>
      </div>
      <div class="ruleEdit" v-if="mode === 'rule'">
        <div v-if="lock" class="lock">
          <div class="similar">
            <input type="checkbox" id="checkbox" v-model="similar" />
            <label for="checkbox" tabindex="0">Apply similar</label>
            <a href="https://github.com/aiktb/FuriganaMaker" target="_blank">
              Advanced settings
              <span v-html="SettingIcon" class="settingIcon" />
            </a>
          </div>
          <div class="container">
            <div class="counter">
              <button class="min">Min</button>
              <button v-html="LeftIcon" class="subtract" @click="level--" />
              <span class="level">{{ level }}</span>
              <button v-html="RightIcon" class="add" @click="level++" />
              <button class="max">Max</button>
            </div>
            <div class="buttons">
              <button class="selectOther">Select a different element</button>
              <button class="apply">Apply</button>
            </div>
          </div>
        </div>
        <div v-else class="unlock">Please select an element first!</div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.main {
  --feature: #0075ff;
  --hover: #27415a;
  --background: #1c2732;
  --font: #f5f5f5da;
}
input {
  display: none;
}

.cursorOutlineIcon {
  display: flex inline;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  color: var(--feature);
}
label {
  cursor: pointer;
  display: flex inline;
  align-items: center;
  font-weight: bold;
}

label:hover {
  text-decoration: underline wavy currentColor;
  color: var(--feature);
  transition: all 250ms;
}
label:before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 10px;
  border: 2px solid var(--font);
  border-radius: 50%;
  vertical-align: middle;
  cursor: pointer;
}

input:checked + label:before {
  background-color: var(--feature);
}

input:checked + label {
  text-decoration: underline wavy var(--feature);
}
.main > div:not(:last-child) {
  border-bottom: 1px solid var(--font);
}

h1,
p {
  margin: 0;
}

h1 {
  font-size: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

a {
  color: var(--font);
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  text-decoration: underline currentColor;
  transition: all 250ms;
}

a:focus,
a:hover {
  color: var(--feature);
}
button {
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: currentColor;
  padding: 0;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

.main {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
  box-shadow: 0 0 10px 3px rgba(162, 161, 161, 0.3);
  position: fixed;
  z-index: 999;
  border-radius: 5px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  color: var(--font);
  width: 600px;
  border: 1px solid var(--font);
  user-select: none;
}

.close {
  display: block;
  position: absolute;
  top: 10px;
  right: 10px;
  transition: all 200ms;
}

.close :deep(svg) {
  width: 22px;
  height: auto;
}

.close:hover,
.close:focus {
  color: var(--feature);
}

.dragArea {
  cursor: move;
  padding: 15px 15px 10px 15px;
}

.mode {
  display: flex;
  align-items: center;
  padding: 15px 15px;
  gap: 15px;
}

.ruleEdit {
  padding: 15px 15px;
}

.unlock {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-decoration: underline;
}

.lock {
  display: flex;
  flex-direction: column;
}

.similar {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.settingIcon {
  display: flex;
  align-items: center;
}
.similar :deep(svg) {
  display: flex inline;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.counter {
  display: flex;
  align-items: center;
  gap: 6px;
}
.counter > button:hover {
  background-color: var(--feature);
  transition: all 250ms;
}
.subtract,
.add {
  border: 2px solid currentColor;
  box-sizing: border-box;
  border-radius: 5px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.max,
.min {
  border: 2px solid currentColor;
  box-sizing: border-box;
  border-radius: 5px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  height: 20px;
  width: 40px;
}
.level {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  border-bottom: 2px solid var(--feature);
  font-weight: bold;
}
.counter > button > :deep(svg) {
  width: 20px;
  height: 20px;
}
.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.buttons > button {
  border: 2px solid currentColor;
  box-sizing: border-box;
  padding: 5px 8px;
  border-radius: 5px;
  font-weight: bold;
}
.buttons > button:hover {
  color: #fff;
  transition: all 250ms;
}

.selectOther {
  background-color: var(--feature);
}

.apply {
  background-color: #8e2c13;
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
