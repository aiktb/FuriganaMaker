<script setup lang="ts">
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
const changeOption = (option: string) => {
  display.value = false
  emit('update:modelValue', option)
  emit('change')
}

const select = ref<HTMLElement | null>(null)
const { focused } = useFocusWithin(select)
watch(focused, () => {
  display.value = false
})
</script>

<template>
  <button
    class="select"
    ref="select"
    :class="{ display: display }"
    @click.self="display = !display"
    tabindex="0"
  >
    {{ props.modelValue }}
    <div v-html="DownIcon" class="selectIcon" />
    <Transition>
      <div class="panel" v-if="display">
        <button
          class="option"
          tabindex="0"
          v-for="option of props.options"
          :class="{ selected: option === props.modelValue }"
          @click="changeOption(option)"
        >
          {{ option }}
        </button>
      </div>
    </Transition>
  </button>
</template>

<style scoped>
button {
  background-color: transparent;
  border: none;
  color: currentColor;
  width: 100%;
  cursor: pointer;
}

.select {
  position: relative;
  cursor: pointer;
  text-transform: capitalize;
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 0.3rem;
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: space-between;
  transition: opacity 250ms ease-in-out;
}

.display {
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

.panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 1.5rem;
  left: 0;
  z-index: 1;
  box-shadow: 0 0 1rem var(--hover);
  border-radius: 0.4rem;
  background-color: var(--background);
  border: 0.1rem solid var(--feature);
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
  text-align: left;
  transition: background-color 250ms ease-in-out;
}

.option:focus,
.option:hover {
  background-color: var(--hover);
}

.option:focus {
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
