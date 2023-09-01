<script setup lang="ts">
import { useClamp } from '@Composables/useClamp'
import { useDraggable } from '@Composables/useDraggable'
import { useElementBounding } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

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
  const newModelValue = Math.round(
    percent * (props.max - props.min) + props.min
  )
  emit('update:modelValue', newModelValue)
  emit('change')
}

const track = ref<HTMLElement | null>(null)
const thumb = ref<HTMLElement | null>(null)
const { left, right, top, width, height } = useElementBounding(track)
const { x: useX } = useDraggable(thumb, track, update)
const x = useClamp(useX, left, right)
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
      x.value++
      break
    case KeyEvent.Subtract:
      x.value--
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
    class="range"
    tabindex="0"
    @keydown.left="keyHandler(KeyEvent.Subtract)"
    @keydown.right="keyHandler(KeyEvent.Add)"
    @keydown.up="keyHandler(KeyEvent.Add)"
    @keydown.down="keyHandler(KeyEvent.Subtract)"
    @keyup="keyHandler(KeyEvent.Emit)"
  >
    <div class="track" ref="track">
      <div class="thumb" ref="thumb" :style="style" />
    </div>
  </div>
</template>

<style scoped>
.range {
  position: relative;
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 0.3rem;
  display: flex;
  align-items: center;
  transition: opacity 250ms ease-in-out;
}

.track {
  height: 12%;
  width: 100%;
  border-radius: 0.5rem;
  background-color: currentColor;
}

.thumb {
  position: fixed;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background-color: var(--feature);
  cursor: pointer;
  transform: translate(-50%, -50%);
}
</style>
