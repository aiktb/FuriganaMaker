<script setup lang="ts">
const props = withDefaults(defineProps<{ tip?: boolean; shiny?: boolean }>(), {
  tip: false,
  shiny: false
})
</script>

<template>
  <div class="menuItem">
    <div class="icon" :class="{ shiny: shiny }">
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

<style scoped>
.menuItem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0;
  position: relative;
}

.icon :deep(div) {
  display: flex;
  align-items: center;
}

.icon :deep(svg) {
  width: 1.5rem;
  height: auto;
}

.shiny {
  color: var(--feature);
}

.content {
  flex-grow: 1;
  border-radius: 0.3rem;
  position: relative;
}

.content:hover,
.content:focus-within {
  transition: all 250ms ease-in-out;
  background-color: var(--hover);
}

.tip {
  color: var(--background);
  background-color: var(--font);
  border-radius: 0.3rem;
  position: absolute;
  z-index: 1;
  top: -65%;
  padding: 0.2rem 0.5rem;
  opacity: 0;
  visibility: hidden;
}

.menuItem:first-child .tip {
  top: 100%;
  left: 2rem;
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
