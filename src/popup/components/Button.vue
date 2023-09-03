<template>
  <button class="button" tabindex="0">
    <slot name="default" />
  </button>
</template>

<style scoped>
.button {
  cursor: pointer;
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 0.3rem;
  display: flex;
  align-items: center;
  background-color: transparent;
  color: var(--font);
  border: none;
  width: 100%;
}
</style>
