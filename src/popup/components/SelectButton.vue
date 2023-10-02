<script setup lang="ts">
import { ref } from 'vue'

import DownIcon from 'data-text:@Icons/Down.svg'

import Button from './Button.vue'
import SelectOptions from './SelectOptions.vue'

const props = defineProps<{
  options: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string]
  change: []
}>()

const display = ref(false)
const selected = ref(props.modelValue)
const selectButton = ref<InstanceType<typeof Button> | null>(null)
const close = () => {
  display.value = false
  selectButton.value?.focus()
  emit('update:modelValue', selected.value)
  emit('change')
}
</script>

<template>
  <Button
    class="selectButton"
    :class="{ display: display }"
    @click="display = true"
    ref="selectButton"
  >
    {{ props.modelValue }}
    <div v-html="DownIcon" class="selectIcon" aria-hidden="true" />
  </Button>
  <Transition>
    <SelectOptions
      v-model="selected"
      :options="options"
      v-if="display"
      @close="close"
      role="listbox"
    />
  </Transition>
</template>

<style scoped>
.selectButton {
  text-transform: capitalize;
}

.display {
  background-color: var(--hover);
  /* @click conflicts with @close caused by FocusWithin changes in SelectOptions component. */
  pointer-events: none;
}

.selectIcon {
  display: none;
}

.display .selectIcon {
  display: flex;
}

.selectIcon :deep(svg) {
  color: var(--feature);
  width: 1rem;
  height: auto;
}

.selectButton:focus-within .selectIcon,
.selectButton:hover .selectIcon {
  display: flex;
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
