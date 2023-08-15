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
  change: [option: string]
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
  emit('change', option)
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
    :value="modelValue"
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
    <div class="panel" :class="{ show: display }">
      <div
        class="option"
        tabindex="0"
        v-for="option of props.options"
        :class="{ selected: option === props.modelValue }"
        @keydown.enter="displaySwitch"
        @click="changeOption(option)"
      >
        {{ option }}
      </div>
    </div>
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

.select:focus-within {
  background-color: var(--gray);
}

.selectIcon {
  display: none;
  color: #aaaaaa;
  width: 1rem;
  height: 1rem;
}

.select:focus-within .selectIcon,
.select:hover .selectIcon {
  display: flex;
  align-items: center;
}

.select:hover {
  background-color: var(--gray);
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
  display: none;
  flex-direction: column;
  position: absolute;
  top: 1.5rem;
  box-sizing: border-box;
  background-color: white;
  transition: all 250ms;
  z-index: 1;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.35);
  border-radius: 0.3rem;
}

.selected {
  background-color: var(--gray);
}

.show {
  display: flex;
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
  background-color: var(--gray);
  z-index: 1;
}

.option:first-child {
  border-radius: 0.3rem 0.3rem 0 0;
}

.option:last-child {
  border-radius: 0 0 0.3rem 0.3rem;
}
</style>
