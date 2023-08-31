<script setup lang="ts">
import { useClamp } from '@Composables/useClamp'
import { useDraggable, useElementBounding } from '@vueuse/core'
import tinycolor from 'tinycolor2'
import { computed, onMounted, ref, watch } from 'vue'

import Button from '@Components/Button.vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string]
  change: []
}>()

const update = (color: string) => {
  emit('update:modelValue', color)
  emit('change')
  display.value = false
}

// prettier-ignore
const colors = [
  'black', 'white', 'tomato', 'moccasin', 'orange',
  'yellow', 'lime', 'aqua', 'teal', 'fuchsia'
]

const display = ref(false)

const hue = ref<HTMLCanvasElement | null>(null)
const hueCursor = ref<HTMLElement | null>(null)
const {
  left: hueLeft,
  right: hueRight,
  top: hueTop,
  width: hueWidth,
  height: hueHeight
} = useElementBounding(hue)
const { x: useHueX } = useDraggable(hueCursor)
const hueX = useClamp(useHueX, hueLeft, hueRight)
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
  right: shadeRight,
  top: shadeTop,
  bottom: shadeBottom,
  width: shadeWidth,
  height: shadeHeight
} = useElementBounding(shade)
const { x: useShadeX, y: useShadeY } = useDraggable(shadeCursor)
const shadeX = useClamp(useShadeX, shadeLeft, shadeRight)
const shadeY = useClamp(useShadeY, shadeTop, shadeBottom)
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
  const isValid = tinycolor(color).isValid()
  if (isValid) {
    const hsv = tinycolor(color).toHsv()
    hueX.value = hueWidth.value * (hsv.h / 360) + hueLeft.value
    shadeX.value = shadeWidth.value * hsv.s + shadeLeft.value
    shadeY.value = shadeHeight.value * (1 - hsv.v) + shadeTop.value
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
})

const pointerdownShade = (event: PointerEvent) => {
  shadeX.value = event.clientX
  shadeY.value = event.clientY
}
</script>

<template>
  <Button @pointerup="display = true" @keydown.enter="display = true">
    Select color
  </Button>
  <Transition>
    <div
      class="panel"
      v-show="display"
      @transitionstart.self="colorToPosition(props.modelValue)"
    >
      <canvas
        class="shade"
        ref="shade"
        :style="{ backgroundColor: hueBarStyle.backgroundColor }"
        @pointerdown="pointerdownShade"
      />
      <div
        class="shadeCursor cursor"
        tabindex="0"
        :style="shadeBarStyle"
        ref="shadeCursor"
        @keydown.up="shadeY--"
        @keydown.down="shadeY++"
        @keydown.left="shadeX--"
        @keydown.right="shadeX++"
      />
      <canvas
        class="hue"
        ref="hue"
        @pointerdown="
          (event) => {
            hueX = event.clientX
          }
        "
      />
      <div
        class="hueCursor cursor"
        tabindex="0"
        :style="hueBarStyle"
        ref="hueCursor"
        @keydown.up="hueX--"
        @keydown.down="hueX++"
        @keydown.left="hueX--"
        @keydown.right="hueX++"
      />
      <div class="switcher">
        <div
          class="color"
          tabindex="0"
          v-for="color of colors"
          :style="{ backgroundColor: color }"
          :class="{ selected: tinycolor(color).toHexString() === input }"
          @pointerup="colorToPosition(color)"
          @keyup.enter="colorToPosition(color)"
        />
      </div>
      <div class="option">
        <input v-model="input" @change="colorToPosition(input)" />
        <button
          class="clear"
          @pointerup="update('currentColor')"
          @keyup.enter="update('currentColor')"
        >
          clear
        </button>
        <button
          class="ok"
          @pointerup="update(input)"
          @keyup.enter="update(input)"
        >
          ok
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.button:hover::after,
.button:focus-within::after {
  display: block;
  content: '';
  position: absolute;
  right: 0.5rem;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background-color: v-bind('props.modelValue');
}

.panel {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
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
  cursor: pointer;
  transition: all 250ms;
  box-shadow:
    0 0 0 0.1rem white,
    inset 0 0 0.1rem 0.1rem #0006,
    0 0 0.1rem 0.1rem #0006;
}

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
  cursor: pointer;
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

.option > input {
  width: 5rem;
  color: var(--font);
  border: 0.1rem solid var(--hover);
  border-radius: 0.2rem;
  background-color: transparent;
  padding-left: 0.3rem;
  outline-color: var(--feature);
  transition: all 250ms ease-in-out;
}

.option > button {
  color: var(--font);
  border-radius: 0.2rem;
  background-color: transparent;
  cursor: pointer;
  transition: all 250ms ease-in-out;
}

.clear {
  color: var(--feature);
  padding: 0 0.2rem;
  grid-column-start: 8;
  border: none;
}

.clear:hover,
.clear:focus {
  color: var(--feature);
  outline: none;
}

.ok {
  grid-column-start: 10;
  border: 0.1rem solid var(--hover);
}

.ok:hover,
.ok:focus {
  border-color: var(--feature);
  color: var(--feature);
  outline: none;
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
