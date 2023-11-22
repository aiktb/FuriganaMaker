<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Icon } from '@iconify/vue'
import { saveAs } from 'file-saver'
import { ref, type Ref } from 'vue'
import { z } from 'zod'

import { Storage } from '@plasmohq/storage'

import { ExtensionStorage, type Rule } from '~contents/core'

import NotFoundRule from './NotFoundRule.vue'
import RuleEditor from './RuleEditor.vue'
import RuleItem from './RuleItem.vue'

const exportPopoverIsOpen = ref(false)
const ruleEditorIsOpen = ref(false)
const importWarningIsOpen = ref(false)

const importFailedMessage = ref('')

const storage = new Storage({ area: 'local' })
const rules: Ref<Rule[]> = ref(await storage.get(ExtensionStorage.UserRules))

const exportConfig = () => {
  const blob = new Blob([JSON.stringify(rules.value, null, 2)], { type: 'application/json' })
  saveAs(blob, 'FuriganaMakerConfig.json')
}

const importConfig = async () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'

  const file: File | null | undefined = await new Promise((resolve) => {
    input.addEventListener('change', () => {
      resolve(input.files?.length ? input.files[0] : null)
    })

    input.click()
  })

  if (file) {
    const reader = new FileReader()
    reader.onload = async () => {
      const checkResult = checkJSONErrorMessage(reader.result as string)
      if (checkResult) {
        importFailedMessage.value = checkResult
        exportPopoverIsOpen.value = true
        return
      }
      const importedRules = JSON.parse(reader.result as string) as Rule[]
      const mergedRules = importedRules.reduce((acc, cur) => {
        const index = acc.findIndex((item) => item.domain === cur.domain)
        if (index !== -1) {
          acc[index]!.selector = `${acc[index]!.selector}, ${cur.selector}`
        } else {
          acc.push(cur)
        }
        return acc
      }, [] as Rule[])
      console.log(mergedRules)

      await storage.set(ExtensionStorage.UserRules, mergedRules)
      rules.value = mergedRules
    }
    reader.readAsText(file)
  }
}

const checkJSONErrorMessage = (data: string) => {
  try {
    const RuleSchema = z.object({
      domain: z.string(),
      selector: z.string(),
      active: z.boolean()
    })
    const RulesSchema = z.array(RuleSchema)
    const result = RulesSchema.safeParse(JSON.parse(data))
    return result.success ? null : result.error.message
  } catch (error) {
    return (error as Error).message
  }
}

const deleteRule = (index: number) => {
  rules.value.splice(index, 1)
  storage.set(ExtensionStorage.UserRules, rules.value)
}

const toggleRule = (index: number) => {
  rules.value[index]!.active = !rules.value[index]!.active
  storage.set(ExtensionStorage.UserRules, rules.value)
}

const createNewRule = (rule: Rule) => {
  const index = rules.value.findIndex((item) => item.domain === rule.domain)
  if (index !== -1) {
    rules.value[index]!.selector = `${rule.selector}, ${rules.value[index]!.selector}`
  } else {
    rules.value.push(rule)
  }
  storage.set(ExtensionStorage.UserRules, rules.value)
  ruleEditorIsOpen.value = false
}

const update = () => {
  storage.set(ExtensionStorage.UserRules, rules.value)
}
</script>

<template>
  <main class="flex grow flex-col justify-start">
    <div
      class="mx-auto my-2 flex max-w-5xl flex-col items-center justify-between gap-1.5 px-5 text-base font-bold text-sky-500 sm:px-6 md:flex-row md:justify-between lg:max-w-7xl lg:px-8"
    >
      <button
        class="flex items-center gap-x-1.5 rounded-md border border-gray-200 px-1.5 py-0.5 shadow-md transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/20"
        @click="ruleEditorIsOpen = true"
      >
        <Icon
          class="h-5 w-5"
          aria-hidden="true"
          icon="material-symbols:add-to-photos-outline-rounded"
        />
        Add New Rule
      </button>
      <div class="flex gap-x-1.5">
        <button
          class="flex items-center gap-x-1.5 rounded-md border border-gray-200 px-1.5 py-0.5 shadow-md transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/20"
          :disabled="rules.length === 0"
          :class="{ 'cursor-not-allowed': rules.length === 0 }"
          @click="exportConfig"
        >
          <Icon class="h-5 w-5" aria-hidden="true" icon="pajamas:export" />
          Export Config
        </button>
        <button
          class="flex cursor-pointer items-center gap-x-1.5 rounded-md border border-gray-200 px-1.5 py-0.5 shadow-md transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/20"
          @click="importWarningIsOpen = true"
        >
          <Icon class="h-5 w-5" aria-hidden="true" icon="pajamas:import" />
          Import Config
        </button>
      </div>
    </div>
    <div
      class="mx-auto flex max-w-3xl items-center justify-between px-4 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <ul
        v-if="rules.length !== 0"
        role="list"
        class="divide-y divide-gray-100 dark:divide-slate-800"
      >
        <TransitionGroup
          enter-from-class="transform translate-x-full opacity-0"
          enter-active-class="transition-all duration-700 ease-in-out"
          enter-to-class="transform translate-x-0"
          leave-from-class="transform translate-x-0"
          leave-active-class="transition-all duration-700 ease-in-out"
          leave-to-class="transform -translate-x-full opacity-0"
        >
          <li v-for="(rule, index) in rules" :key="rule.domain">
            <RuleItem
              :rule="rule"
              @delete="deleteRule(index)"
              @toggle="toggleRule(index)"
              @update="
                (rule) => {
                  rules[index] = rule
                  update()
                }
              "
            />
          </li>
        </TransitionGroup>
      </ul>
      <NotFoundRule v-else />
    </div>
  </main>
  <TransitionRoot appear :show="exportPopoverIsOpen" as="template">
    <Dialog as="div" class="relative z-20" @close="exportPopoverIsOpen = false">
      <div class="fixed inset-0 backdrop-blur backdrop-filter" aria-hidden="true" />
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
              >
                Invalid JSON format!
              </DialogTitle>
              <div class="mt-2">
                <p class="whitespace-pre-wrap text-sm text-gray-500 dark:text-gray-400">
                  {{ importFailedMessage }}
                </p>
              </div>
              <div class="mt-4">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  @click="exportPopoverIsOpen = false"
                >
                  I Got It!
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <TransitionRoot appear :show="ruleEditorIsOpen" as="template">
    <Dialog as="div" class="relative z-20" @close="ruleEditorIsOpen = false">
      <div class="fixed inset-0 backdrop-blur backdrop-filter" aria-hidden="true" />
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900"
            >
              <RuleEditor @create="createNewRule" />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <TransitionRoot appear :show="importWarningIsOpen" as="template">
    <Dialog as="div" class="relative z-20" @close="importWarningIsOpen = false">
      <div class="fixed inset-0 backdrop-blur backdrop-filter" aria-hidden="true" />
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
              >
                Warning!
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  This will overwrite the existing configuration file and this action is not
                  undoable, sure about this?
                </p>
              </div>
              <div class="mt-4 flex gap-2.5">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                  @click="
                    () => {
                      importConfig()
                      importWarningIsOpen = false
                    }
                  "
                >
                  Import
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  @click="importWarningIsOpen = false"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
