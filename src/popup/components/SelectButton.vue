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
  <Transition>
    <SelectOptions
      v-if="display"
      v-model="selected"
      class="peer"
      :open="display"
      :options="options"
      role="listbox"
      @close="close"
    />
  </Transition>
  <BaseButton
    ref="selectButton"
    class="group rounded-md capitalize peer-open:pointer-events-none peer-open:bg-slate-300 dark:peer-open:bg-slate-700"
    @click="display = true"
  >
    {{ props.modelValue }}
    <Icon
      class="hidden text-[--feature-color] group-focus-within:flex group-hover:flex peer-open:flex"
      aria-hidden="true"
      icon="ep:arrow-down-bold"
    />
  </BaseButton>
</template>
