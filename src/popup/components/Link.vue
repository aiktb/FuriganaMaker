<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
  link: string
}>()
</script>

<template>
  <a target="_blank" :href="props.link" class="link">
    <slot name="default" />
    <Icon icon="ci:link" aria-hidden="true" />
  </a>
</template>

<style scoped>
.link {
  appearance: none;
  cursor: pointer;
  color: currentColor;
  text-decoration: none;
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 0.3rem;
  display: flex;
  align-items: center;
  transition: color 500ms ease-in-out;
  gap: 0.3rem;
}

.link:focus,
.link:hover {
  color: var(--feature);
}
</style>
