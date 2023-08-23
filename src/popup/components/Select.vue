<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { useFocusWithin } from '@vueuse/core'
import { ref, watch } from 'vue'

import DownIcon from 'data-text:@Icons/Down.svg'

const props = defineProps<{
  options: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string]
  change: []
}>()

const display = ref(false)
const displaySwitch = () => {
  display.value = !display.value
}

const displayOff = () => {
  display.value = false
}

const changeOption = (option: string) => {
  displayOff()
  // The order of emit of the following events cannot be reversed.
  emit('update:modelValue', option)
  emit('change')
}

const select = ref<HTMLElement | null>(null)
const { focused } = useFocusWithin(select)
watch(focused, () => {
  displayOff()
})
</script>

<template>
  <div
    class="select"
    ref="select"
    v-on-click-outside="displayOff"
    :class="{ display: display }"
  >
    <div
      class="promptBar"
      tabindex="0"
      @keydown.enter="displaySwitch"
      @click="displaySwitch"
    >
      {{ props.modelValue }}
      <div v-html="DownIcon" class="selectIcon" />
    </div>
    <Transition>
      <div class="panel" v-if="display">
        <div
          class="option"
          tabindex="0"
          v-for="option of props.options"
          :class="{ selected: option === props.modelValue }"
          @keydown.enter="changeOption(option)"
          @click="changeOption(option)"
        >
          {{ option }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.select {
  flex-grow: 1;
  position: relative;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: all 250ms;
  text-transform: capitalize;
}

.display {
  background-color: var(--hover);
}

.select:hover,
.select:focus-within {
  transition: all 250ms;
  background-color: var(--hover);
}

.selectIcon {
  display: none;
  color: var(--feature);
  width: 1rem;
  height: auto;
}

.select:focus-within .selectIcon,
.select:hover .selectIcon {
  display: flex;
  align-items: center;
}

.promptBar {
  border-radius: 0.3rem;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 0.5rem;
  box-sizing: border-box;
  height: 1.5rem;
  transition: all 250ms;
  text-align: left;
  justify-content: space-between;
}

.panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 1.5rem;
  box-sizing: border-box;
  transition: all 250ms;
  z-index: 1;
  box-shadow: 0 0 1rem var(--hover);
  border-radius: 0.4rem;
  background-color: var(--background);
  border: 0.1rem solid var(--hover);
}

.selected {
  background-color: var(--hover);
  color: var(--feature);
}

.option {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  box-sizing: border-box;
  height: 1.5rem;
  transition: all 250ms;
  text-align: left;
}

.option:focus,
.option:hover {
  background-color: var(--hover);
  z-index: 1;
}

.option:first-child {
  border-radius: 0.3rem 0.3rem 0 0;
}

.option:last-child {
  border-radius: 0 0 0.3rem 0.3rem;
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
