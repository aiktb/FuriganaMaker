<script setup lang="ts">
import Logo from 'data-text:@Icons/Logo.svg'

import MainMenu from './MainMenu.vue'
</script>

<!-- All because <Menu /> needs to load chrome.storage asynchronously. -->
<template>
  <Suspense>
    <template #default>
      <MainMenu />
    </template>
    <template #fallback>
      <div class="logo" v-html="Logo" />
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
  src:
    local('JetBrains Mono'),
    url('../../assets/fonts/jetbrains-mono-v18-latin-700.woff2') format('woff2');
}

html {
  font-size: 16px;
  color: var(--font);
  background-color: var(--background);
  user-select: none;
}

* {
  font-family: 'JetBrains Mono', monospace;
  box-sizing: border-box;
  text-align: left;
  font-size: 1rem;
  margin: 0;
  padding: 0;
}

button {
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: currentColor;
}

:focus-visible {
  outline: 0.15rem solid var(--font);
  box-shadow: none;
}

.logo svg {
  width: 13.5rem;
  height: 13.5rem;
}
</style>
