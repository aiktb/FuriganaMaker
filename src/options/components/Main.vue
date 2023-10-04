<script setup lang="ts">
import { Storage } from '@plasmohq/storage'

import { ExtensionEvent, Rule } from '~contents/core'

const storage = new Storage({ area: 'local' })
const rules: Rule[] = await storage.get(ExtensionEvent.Rules)
</script>

<template>
  <main>
    <table>
      <thead>
        <tr>
          <th>Domain</th>
          <th>Name</th>
          <th>Valid</th>
          <th>Observer</th>
        </tr>
      </thead>
      <tbody>
        <div v-for="(rule, index) in rules" :key="index">
          <tr v-for="(selector, index) in rule.selector" :key="index">
            <td>{{ rule.domain }}</td>
            <td><input type="text" v-model="selector.name" /></td>
            <td><input type="checkbox" v-model="selector.valid" /></td>
            <td><input type="checkbox" v-model="selector.observer" /></td>
          </tr>
        </div>
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
  background-color: #fff;
  color: #212529;
  border: 1px solid #dee2e6;
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
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

table tbody tr:nth-of-type(even) {
  background-color: #f2f2f2;
}
</style>
