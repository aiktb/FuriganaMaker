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
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: all 250ms;
  padding: 0 0.5rem;
}

.button:hover,
.button:focus-within {
  background-color: var(--hover);
}
</style>
