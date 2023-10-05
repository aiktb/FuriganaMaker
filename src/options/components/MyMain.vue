<script setup lang="ts">
import { ref } from 'vue'

import { Storage } from '@plasmohq/storage'

import { ExtensionStorage, Rule } from '~contents/core'

// import { Field, makeCompareFn, State } from '../util/sort'
import TableButton from './TableButton.vue'

const storage = new Storage({ area: 'local' })
const originalRules: Rule[] = await storage.get(ExtensionStorage.UserRule)
const shownRules: Rule[] = originalRules
const domainButton = ref<InstanceType<typeof TableButton> | null>(null)
const selectorButton = ref<InstanceType<typeof TableButton> | null>(null)
const dynamicButton = ref<InstanceType<typeof TableButton> | null>(null)
const enabledButton = ref<InstanceType<typeof TableButton> | null>(null)
// const sort = (field: Field, order: State) => {
//   if (order === State.DEFAULT) {
//     shownRules.values = originalRules.values
//   } else {
//     const comparedFn = makeCompareFn(field, order)
//     shownRules.sort(comparedFn)
//   }
// }
</script>

<template>
  <main>
    <table>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">
            <TableButton ref="domainButton"> Domain </TableButton>
          </th>
          <th scope="col">
            <TableButton ref="selectorButton"> CSS Selector </TableButton>
          </th>
          <th scope="col">
            <TableButton ref="dynamicButton"> Dynamic </TableButton>
          </th>
          <th scope="col">
            <TableButton ref="enabledButton"> Enabled </TableButton>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rule, index) in shownRules" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ rule.domain }}</td>
          <td>{{ rule.selector }}</td>
          <td>{{ rule.dynamic }}</td>
          <td>{{ rule.enabled }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid #dee2e6;
}

table tr th button {
  box-shadow: inset 0 0 0 1px currentColor;
  color: #00dc82;
  border: none;
  border-radius: 9999px;
  display: inline-flex;
  column-gap: 0.25rem;
  align-items: center;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

table tr th button:hover {
  background-color: #052e16;
}
table th {
  font-weight: bold;
  color: #fff;
}

table tr td:first-child {
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
}

table th,
table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

table th {
  font-weight: bold;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
}
</style>
