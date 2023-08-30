<script setup lang="ts">
import LinkIcon from 'data-text:@Icons/Link.svg'

const props = defineProps<{
  link: string
}>()
</script>

<template>
  <a target="_blank" :href="props.link" class="link">
    <slot name="default" />
    <div v-html="LinkIcon" class="linkIcon" />
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
  transition: all 250ms;
}

.link:focus,
.link:hover {
  color: var(--feature);
}

.linkIcon {
  display: flex;
  align-items: center;
  margin-left: 0.3rem;
  width: 0.8rem;
  height: auto;
}
</style>
