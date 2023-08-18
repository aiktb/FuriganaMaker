<script setup lang="ts">
import FillLogoIcon from 'data-text:@Icons/FillLogo.svg'

import Menu from '~popup/Menu.vue'
</script>

<!-- All because <Menu /> needs to load chrome.storage asynchronously. -->
<template>
  <Suspense>
    <template #default>
      <Menu />
    </template>
    <template #fallback>
      <div v-html="FillLogoIcon" class="logo" />
    </template>
  </Suspense>
</template>

<style>
:root {
  --feature: #0075ff;
  --hover: #e1e1e1;
  --background: #f5f5f5;
  --font: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --feature: #0075ff;
    --hover: #203549;
    --background: #1c2732;
    --font: #f5f5f5da;
  }
}

body {
  font-size: 13px;
  color: var(--font);
  background-color: var(--background);
}

:focus-visible {
  outline: 2px solid var(--font);
  box-shadow: none;
  transition: all 100ms !important;
}

.logo svg {
  width: 13.5rem;
  height: 13.5rem;
}
</style>
