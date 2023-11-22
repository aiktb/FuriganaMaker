<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

import { type Rule } from '~contents/core'

const props = defineProps<{
  rule?: Rule
}>()

const emit = defineEmits<{
  create: [rule: Rule]
  update: [rule: Rule]
}>()

const domain = ref(props.rule?.domain ?? '')
const selector = ref(props.rule?.selector ?? '')

const submit = () => {
  if (props.rule) {
    emit('update', {
      ...props.rule,
      selector: selector.value
    })
  } else {
    emit('create', {
      domain: domain.value,
      selector: selector.value,
      active: true
    })
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-md rounded-2xl p-2">
    <Disclosure v-slot="{ open }">
      <DisclosureButton
        class="flex w-full items-center justify-between rounded-lg bg-sky-100 px-4 py-2 text-left text-sm font-medium text-sky-900 hover:bg-sky-200 focus:outline-none focus-visible:ring focus-visible:ring-sky-500/75 dark:bg-sky-900 dark:text-sky-300"
      >
        <span>What is selector field?</span>
        <Icon
          icon="ep:arrow-down-bold"
          :class="{ 'rotate-180 transform': open }"
          class="h-4 w-4 text-sky-500"
        />
      </DisclosureButton>
      <DisclosurePanel class="px-4 pb-2 pt-4 text-sm">
        <section>
          <ul class="list-disc marker:text-black dark:marker:text-white">
            <li class="my-2">
              The
              <code
                class="font-mono text-sm font-bold text-slate-900 before:content-['`'] after:content-['`'] dark:text-slate-200"
                >selector</code
              >
              field uses the
              <a
                class="cursor-pointer border-b border-sky-500 font-bold text-slate-900 hover:border-b-2 dark:text-slate-200"
                >CSS selector</a
              >
              syntax to specify the element to be tagged on the page.
            </li>
            <li class="my-2">
              If you are not familiar with the CSS selector syntax, please do not modify this field,
              as this may invalidate the extension.
            </li>
            <li class="my-2">
              Most sites can specify this field as
              <code
                class="font-mono text-sm font-bold text-slate-900 before:content-['`'] after:content-['`'] dark:text-slate-200"
                >body</code
              >
              , which adds Furigana to Japanese text on most pages.
            </li>
            <li class="my-2">
              The
              <code
                class="font-mono text-sm font-bold text-slate-900 before:content-['`'] after:content-['`'] dark:text-slate-200"
                >selector</code
              >
              fields are separated by comma, and selectors corresponding to the same
              <code
                class="font-mono text-sm font-bold text-slate-900 before:content-['`'] after:content-['`'] dark:text-slate-200"
                >domain</code
              >
              will be merged directly.
            </li>
          </ul>
        </section>
      </DisclosurePanel>
    </Disclosure>

    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2
          class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white"
        >
          <span> {{ props.rule ? 'Update' : 'Create' }} </span> your custom rule
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6">
          <div>
            <label
              for="domain"
              class="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200"
              >Domain</label
            >
            <div class="mt-2">
              <input
                id="domain"
                v-model="domain"
                name="domain"
                :disabled="!!props.rule?.domain"
                required
                placeholder="example.com"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 disabled:cursor-not-allowed dark:bg-slate-900 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="selector"
                class="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200"
                >Selector</label
              >
              <div class="text-sm">
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors"
                  class="font-semibold text-sky-600 transition hover:text-sky-500 dark:text-sky-500 dark:hover:text-sky-600"
                >
                  Don't know selector?
                </a>
              </div>
            </div>
            <div class="mt-2">
              <input
                id="selector"
                v-model="selector"
                name="selector"
                required
                placeholder="body"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              class="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed"
              :disabled="!domain || !selector"
              @click.prevent="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
