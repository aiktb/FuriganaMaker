<script setup lang="ts"></script>

<template>
  <div class="button" tabindex="0" @keydown.enter="$emit('click')">
    <slot name="default" />
  </div>
</template>

<style scoped>
.button {
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
  outline: none;
}

.button:hover,
.button:focus {
  background-color: var(--gray);
}

.button:focus {
  box-shadow: 0 0 0 2px black;
}
</style>
