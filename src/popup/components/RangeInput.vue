<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

import { useDraggable } from '../composables/useDraggable'

const props = defineProps<{
  modelValue: number
  min: number
  max: number
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: number]
  change: []
}>()

const update = () => {
  const percent = (x.value - left.value) / width.value
  const newModelValue = Math.round(percent * (props.max - props.min) + props.min)
  emit('update:modelValue', newModelValue)
  emit('change')
}

const track = ref<HTMLElement | null>(null)
const slider = ref<HTMLElement | null>(null)
const { left, right, top, width, height } = useElementBounding(track)
const { x } = useDraggable(slider, track, update)
const style = computed(() => {
  return {
    left: `${x.value}px`,
    top: `${top.value + height.value / 2}px`
  }
})

// prettier-ignore
enum KeyEvent { Add, Subtract, Emit }
const keyHandler = (type: KeyEvent) => {
  switch (type) {
    case KeyEvent.Add:
      x.value = Math.min(Math.max(x.value + 1, left.value), right.value)
      break
    case KeyEvent.Subtract:
      x.value = Math.min(Math.max(x.value - 1, left.value), right.value)
      break
    case KeyEvent.Emit:
      update()
      break
  }
}

onMounted(() => {
  const percent = (props.modelValue - props.min) / (props.max - props.min)
  x.value = percent * width.value + left.value
})
</script>

<template>
  <div
    class="relative flex h-5 grow items-center rounded px-2"
    tabindex="0"
    role="slider"
    :aria-valuemin="props.min"
    :aria-valuemax="props.max"
    :aria-valuetext="props.modelValue.toString()"
    aria-label="Font size"
    @keydown.left="keyHandler(KeyEvent.Subtract)"
    @keydown.right="keyHandler(KeyEvent.Add)"
    @keydown.up="keyHandler(KeyEvent.Add)"
    @keydown.down="keyHandler(KeyEvent.Subtract)"
    @keyup="keyHandler(KeyEvent.Emit)"
  >
    <div ref="track" class="h-[3px] w-full rounded-lg bg-current">
      <div
        ref="slider"
        class="fixed h-3.5 w-3.5 cursor-pointer rounded-full bg-[--feature-color] [transform:translate(-50%,-50%)]"
        :style="style"
      />
    </div>
  </div>
</template>
