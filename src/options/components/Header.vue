<script setup lang="ts">
import Logo from 'data-text:@Icons/Logo.svg'
</script>

<template>
  <header>
    <div class="title">
      <div v-html="Logo" class="logo" />
      Furigana Maker
    </div>
    <div class="github"></div>
  </header>
</template>

<style scoped>
header {
  padding: 1rem;
}
.title {
  display: flex;
  align-items: center;
  font-size: 1.5em;
  gap: 0.5em;
  font-weight: bold;
  font-family: 'JetBrains Mono', monospace;
  color: #00d4ff;
}
:deep(svg) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.logo {
  width: 1.5em;
}
</style>
