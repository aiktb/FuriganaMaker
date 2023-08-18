<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { computed, ref } from 'vue'

interface Props {
  tip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tip: false
})

const tip = ref<HTMLElement | null>(null)

const { top } = useElementBounding(tip)

const isTopTip = computed(() => {
  console.log(top.value)
  return top.value < 40
})
</script>

<template>
  <div class="menuItem">
    <div class="icon">
      <slot name="icon" />
    </div>
    <div class="content">
      <slot name="content" />
    </div>
    <div class="tip" ref="tip" :class="{ topTip: isTopTip }" v-if="props.tip">
      <slot name="tip" />
    </div>
  </div>
</template>

<style>
.topTip {
  bottom: -1.3rem !important;
  left: 2rem;
}

.menuItem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0rem;
  position: relative;
}

.icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.content {
  flex-grow: 1;
}

.tip {
  box-sizing: border-box;
  color: var(--white);
  line-height: 1rem;
  background-color: #2b2b2b;
  border-radius: 0.3rem;
  position: absolute;
  z-index: 1;
  bottom: 2rem;
  padding: 0 0.5rem;
  line-height: 1.5rem;
  opacity: 0;
  visibility: hidden;
  will-change: transform;
  transition: all 120ms;
  font-weight: normal;
}

.content:hover + .tip,
.content:focus-within + .tip {
  opacity: 1;
  transform: translateY(-1px) scale(1);
  transition:
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 133ms cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.7s;
  visibility: visible;
}
</style>
