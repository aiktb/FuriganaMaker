<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

import BaseButton from './BaseButton.vue'
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
const selectButton = ref<InstanceType<typeof BaseButton> | null>(null)
const close = () => {
  display.value = false
  selectButton.value?.focus()
  emit('update:modelValue', selected.value)
  emit('change')
}
</script>

<template>
  <BaseButton
    ref="selectButton"
    class="selectButton"
    :class="{ display: display }"
    @click="display = true"
  >
    {{ props.modelValue }}
    <Icon icon="ep:arrow-down-bold" class="icon" aria-hidden="true" />
  </BaseButton>
  <Transition>
    <SelectOptions
      v-if="display"
      v-model="selected"
      :options="options"
      role="listbox"
      @close="close"
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

.icon {
  display: none;
  color: var(--feature);
}

.display .icon {
  display: flex;
}

.selectButton:focus-within .icon,
.selectButton:hover .icon {
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
