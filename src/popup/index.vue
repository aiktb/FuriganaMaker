<script setup lang="ts">
import Logo from 'data-text:@Icons/Logo.svg'

import Menu from '~popup/Menu.vue'
</script>

<!-- All because <Menu /> needs to load chrome.storage asynchronously. -->
<template>
  <Suspense>
    <template #default>
      <Menu />
    </template>
    <template #fallback>
      <div v-html="Logo" class="logo" />
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
    --hover: #27415a;
    --background: #1c2732;
    --font: #f5f5f5da;
  }
}

@font-face {
  font-display: swap;
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  src: url('../../assets/jetbrains-mono.woff2') format('woff2');
}

body {
  font-size: 13px;
  color: var(--font);
  background-color: var(--background);
  margin: 0.7rem;
  user-select: none;
}

* {
  font-family: 'JetBrains Mono';
  box-sizing: border-box;
  text-align: left;
}

:focus {
  outline: 2px solid var(--font);
  box-shadow: none;
}

.logo svg {
  width: 13.5rem;
  height: 13.5rem;
}
</style>
