<script setup lang="ts">
import { useFocusWithin } from '@vueuse/core'
import { ref, watch } from 'vue'

import Button from '@Components/Button.vue'

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

const panel = ref<HTMLElement | null>(null)
const { focused } = useFocusWithin(panel)
watch(focused, () => {
  if (!focused.value) {
    display.value = false
  }
})
</script>

<template>
  <Button
    class="select"
    :class="{ display: display }"
    @click="display = !display"
    @keydown.shift.tab="display = false"
  >
    {{ props.modelValue }}
    <div v-html="DownIcon" class="selectIcon" />
  </Button>
  <Transition>
    <div class="panel" v-if="display" ref="panel" tabindex="-1">
      <button
        class="option"
        v-for="option of props.options"
        :class="{ selected: option === props.modelValue }"
        @click="changeOption(option)"
      >
        {{ option }}
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.select {
  text-transform: capitalize;
}

.display {
  background-color: var(--hover);
}

.display .selectIcon {
  display: flex;
}
.selectIcon {
  display: none;
}

.selectIcon :deep(svg) {
  color: var(--feature);
  width: 1rem;
  height: auto;
}

.select:focus-within .selectIcon,
.select:hover .selectIcon {
  display: flex;
}

.panel {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 1;
  box-shadow: 0 0 0.1rem 0.1rem var(--font);
  border-radius: 0.4rem;
  background-color: var(--background);
  border: 0.1rem solid var(--hover);
}

.selected {
  background-color: var(--hover);
}

.option {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  box-sizing: border-box;
  height: 1.5rem;
  text-align: left;
  transition: background-color 250ms ease-in-out;
  text-transform: capitalize;
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
