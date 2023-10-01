<script setup lang="ts">
import { useElementBounding, useFocusWithin } from '@vueuse/core'
import tinycolor from 'tinycolor2'
import { computed, onMounted, ref, watch } from 'vue'

import { useDraggable } from '../composables/useDraggable'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string]
  close: []
}>()

const update = (color: string) => {
  emit('update:modelValue', color)
  emit('close')
}

const panel = ref<HTMLElement | null>(null)
const { focused } = useFocusWithin(panel)
watch(focused, () => {
  if (!focused.value) {
    emit('close')
  }
})

// prettier-ignore
const colors = [
  'black', 'white', 'tomato', 'moccasin', 'orange',
  'yellow', 'lime', 'aqua', 'teal', 'fuchsia'
]

const hue = ref<HTMLCanvasElement | null>(null)
const hueCursor = ref<HTMLElement | null>(null)
const {
  left: hueLeft,
  top: hueTop,
  width: hueWidth,
  height: hueHeight
} = useElementBounding(hue)
const { x: hueX } = useDraggable(hueCursor, hue)
const hueBarStyle = computed(() => {
  return {
    left: `${hueX.value}px`,
    top: `${hueTop.value + hueHeight.value / 2}px`,
    backgroundColor: `hsl(${hsv.value.h}, 100%, 50%)`
  }
})

const shade = ref<HTMLCanvasElement | null>(null)
const shadeCursor = ref<HTMLElement | null>(null)
const {
  left: shadeLeft,
  top: shadeTop,
  width: shadeWidth,
  height: shadeHeight
} = useElementBounding(shade)
const { x: shadeX, y: shadeY } = useDraggable(shadeCursor, shade)
const shadeBarStyle = computed(() => {
  return {
    left: `${shadeX.value}px`,
    top: `${shadeY.value}px`,
    backgroundColor: tinycolor(hsv.value).toHslString()
  }
})

const hsv = computed(() => {
  const hue = ((hueX.value - hueLeft.value) / hueWidth.value) * 360
  const saturation = (shadeX.value - shadeLeft.value) / shadeWidth.value
  const value = 1 - (shadeY.value - shadeTop.value) / shadeHeight.value
  return { h: hue, s: saturation, v: value }
})

const input = ref(props.modelValue)

watch(hsv, (hsv) => {
  input.value = tinycolor(hsv).toHexString()
})

const colorToPosition = (color: string) => {
  if (tinycolor(color).isValid()) {
    const hsv = tinycolor(color).toHsv()
    hueX.value = hueWidth.value * (hsv.h / 360) + hueLeft.value
    shadeX.value = shadeWidth.value * hsv.s + shadeLeft.value
    shadeY.value = shadeHeight.value * (1 - hsv.v) + shadeTop.value
  } else if (color === 'currentColor') {
    hueX.value = hueLeft.value
    shadeX.value = shadeLeft.value
    shadeY.value = shadeTop.value
  }
}

onMounted(() => {
  const hueCanvas = hue.value!
  const hueCtx = hueCanvas.getContext('2d')!
  const hueGradient = hueCtx.createLinearGradient(0, 0, hueCanvas.width, 0)
  for (let percent = 0; percent <= 1; percent += 1 / 6) {
    hueGradient.addColorStop(percent, `hsl(${percent * 360}, 100%, 50%)`)
  }
  hueCtx.fillStyle = hueGradient
  hueCtx.fillRect(0, 0, hueCanvas.width, hueCanvas.height)
  const shadeCanvas = shade.value!
  const shadeCtx = shadeCanvas.getContext('2d')!
  // prettier-ignore
  const whiteGradient = shadeCtx.createLinearGradient(0, 0, shadeCanvas.width, 0)
  whiteGradient.addColorStop(0, '#ffffff')
  whiteGradient.addColorStop(1, 'transparent')
  // prettier-ignore
  const blackGradient = shadeCtx.createLinearGradient(0, 0, 0, shadeCanvas.height)
  blackGradient.addColorStop(0, 'transparent')
  blackGradient.addColorStop(1, '#000000')
  shadeCtx.fillStyle = whiteGradient
  shadeCtx.fillRect(0, 0, shadeCanvas.width, shadeCanvas.height)
  shadeCtx.fillStyle = blackGradient
  shadeCtx.fillRect(0, 0, shadeCanvas.width, shadeCanvas.height)

  colorToPosition(props.modelValue)
  panel.value?.focus()
})
</script>

<template>
  <div class="panel" ref="panel" tabindex="-1">
    <canvas
      class="shade"
      ref="shade"
      :style="{ backgroundColor: hueBarStyle.backgroundColor }"
    />
    <button
      class="shadeCursor cursor"
      :style="shadeBarStyle"
      ref="shadeCursor"
      @keydown.up="shadeY--"
      @keydown.down="shadeY++"
      @keydown.left="shadeX--"
      @keydown.right="shadeX++"
      @keyup.enter="update(input)"
    />
    <canvas class="hue" ref="hue" />
    <button
      class="hueCursor cursor"
      :style="hueBarStyle"
      ref="hueCursor"
      @keydown.up="hueX--"
      @keydown.down="hueX++"
      @keydown.left="hueX--"
      @keydown.right="hueX++"
      @keyup.enter="update(input)"
    />
    <div class="switcher">
      <button
        class="color"
        v-for="color of colors"
        :style="{ backgroundColor: color }"
        :class="{ selected: tinycolor(color).toHexString() === input }"
        @click="colorToPosition(color)"
      />
    </div>
    <div class="option">
      <input class="input" v-model="input" @change="colorToPosition(input)" />
      <button class="clear" @click="update('currentColor')">CLEAR</button>
      <button class="ok" @click="update(input)">OK</button>
    </div>
  </div>
</template>

<style scoped>
.panel {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: var(--background);
  z-index: 1;
  padding: 0.8rem 0.8rem;
}

.shade {
  width: 100%;
  height: 65%;
  border-radius: 0.1rem;
  box-shadow:
    0 0 0 0.05rem var(--background),
    0 0 0.05rem 0.05rem var(--font);
}

.hue {
  width: 100%;
  height: 3%;
  border-radius: 0.2rem;
}

.cursor {
  border-radius: 50%;
  position: fixed;
  transform: translate(-50%, -50%);
  box-shadow:
    0 0 0 0.1rem white,
    inset 0 0 0.1rem 0.1rem #0006,
    0 0 0.1rem 0.1rem #0006;
  transition: all 250ms;
}

.cursor:hover,
.cursor:focus {
  transition: none;
}

.cursor:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 0.2rem white,
    inset 0 0 0.1rem 0.1rem #0006,
    0 0 0.2rem 0.2rem #0006;
}

.shadeCursor {
  width: 1rem;
  height: 1rem;
}

.hueCursor {
  width: 0.8rem;
  height: 0.8rem;
}

.switcher {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.color {
  width: 1rem;
  height: 1rem;
  border-radius: 0.2rem;
  border: 0.1rem solid var(--hover);
}

.selected {
  box-shadow: 0 0 0.2rem 0.2rem var(--feature);
  border: none;
}

.option {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  width: 100%;
}

.input {
  width: 5rem;
  color: var(--font);
  border: 0.1rem solid var(--hover);
  border-radius: 0.2rem;
  background-color: transparent;
  padding-left: 0.3rem;
  outline-color: var(--feature);
  transition: all 100ms ease-in-out;
  text-transform: uppercase;
}

.clear {
  padding: 0 0.2rem;
  grid-column-start: 6;
  border: none;
  border-radius: 0.2rem;
  transition: all 250ms ease-in-out;
}

.clear:hover {
  color: var(--feature);
}

.ok {
  grid-column-start: 8;
  grid-column-end: span 3;
  border: 0.1rem solid var(--hover);
  border-radius: 0.2rem;
  transition: all 250ms ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ok:hover {
  border-color: var(--feature);
  color: var(--feature);
  background-color: var(--hover);
}
</style>
