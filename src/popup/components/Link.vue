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
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  padding: 0 0.5rem;
  color: currentColor;
  text-decoration: none;
  transition: all 250ms;
}

.link:focus,
.link:hover {
  background-color: var(--hover);
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
