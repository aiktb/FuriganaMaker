<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

import { Storage } from '@plasmohq/storage'

import { ExtensionStorage, Rule } from '~contents/core'

const storage = new Storage({ area: 'local' })
const rules: Rule[] = await storage.get(ExtensionStorage.UserRule)
const rulesJSON = ref(JSON.stringify(rules, null, 2))

const validJSON = ref(true)

const cancel = () => {
  validJSON.value = true
  rulesJSON.value = JSON.stringify(rules, null, 2)
}
const save = () => {
  try {
    const newJsonConfig = JSON.parse(rulesJSON.value)
    // JSON schema validation check.
    const isValid =
      Array.isArray(newJsonConfig) &&
      newJsonConfig.every((object) => {
        return (
          'domain' in object &&
          'selector' in object &&
          'dynamic' in object &&
          'enabled' in object
        )
      })
    if (isValid) {
      validJSON.value = true
      storage.set(ExtensionStorage.UserRule, newJsonConfig as Rule[])
    }
  } catch (error) {
    validJSON.value = false
  }
}
const copy = () => {
  navigator.clipboard.writeText(rulesJSON.value)
}
</script>

<template>
  <Transition>
    <div
      v-if="!validJSON"
      class="my-3 flex w-full items-center rounded-md bg-red-300 p-4 py-2 text-lg font-[500] text-red-600 outline outline-2 outline-current"
    >
      <Icon class="mr-2 inline-block h-5 w-5" icon="carbon:error" />
      Invalid JSON format, please check your JSON config!
    </div>
  </Transition>
  <div
    class="my-3 flex w-full justify-between gap-x-2 rounded-md bg-slate-900 p-4 py-2 text-lg font-[500] outline outline-2 outline-slate-600"
  >
    <button
      class="flex cursor-pointer items-center transition-all hover:text-sky-400"
      @click="cancel"
    >
      Cancel
      <Icon class="ml-1 inline-block h-5 w-5" icon="carbon:close-outline" />
    </button>
    <button
      class="flex cursor-pointer items-center transition-all hover:text-sky-400"
      @click="save"
    >
      Save
      <Icon class="ml-1 inline-block h-5 w-5" icon="carbon:save" />
    </button>
    <button
      class="flex cursor-pointer items-center transition-all hover:text-sky-400"
      @click="copy"
    >
      <span class="sm:hidden">Copy</span>
      <span class="hidden sm:inline">Copy JSON config</span>
      <Icon class="ml-1 inline-block h-5 w-5" icon="carbon:copy" />
    </button>
  </div>
  <textarea
    v-model="rulesJSON"
    spellcheck="false"
    class="min-h-screen w-full whitespace-nowrap rounded-md bg-slate-900 bg-transparent p-3 font-mono outline outline-2 outline-slate-600 focus:outline-[3px] focus:outline-sky-400"
    @keydown.ctrl.s.prevent="save"
  />
</template>
