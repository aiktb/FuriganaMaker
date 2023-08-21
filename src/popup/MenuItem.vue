<script setup lang="ts">
interface Props {
  tip?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  tip: false
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
    <div class="tip" ref="tip" v-if="props.tip">
      <slot name="tip" />
    </div>
  </div>
</template>

<style>
.menuItem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0rem;
  position: relative;
}

.icon svg {
  width: 1.5rem;
  height: auto;
}

.content {
  flex-grow: 1;
  border-radius: 0.3rem;
}

.tip {
  box-sizing: border-box;
  color: var(--background);
  background-color: var(--font);
  border-radius: 0.3rem;
  position: absolute;
  z-index: 1;
  bottom: 2rem;
  padding: 0.2rem 0.5rem;
  opacity: 0;
  visibility: hidden;
  will-change: transform;
  transition: all 120ms;
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
