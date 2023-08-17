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
  display: flex;
  align-items: center;
  flex-grow: 1;
  box-sizing: border-box;
  height: 1.5rem;
  text-align: left;
  background-color: transparent;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: all 250ms;
  padding: 0 0.5rem;
  color: currentColor;
  text-decoration: none;
}

.link:hover,
.link:focus {
  background-color: var(--gray);
  color: var(--blue);
}

.link:focus {
  box-shadow: 0 0 0 2px var(--black);
}

.linkIcon {
  display: flex;
  align-items: center;
  margin-left: 0.3rem;
  width: 0.8rem;
  height: 0.8rem;
}
</style>
