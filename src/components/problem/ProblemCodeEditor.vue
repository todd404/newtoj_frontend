<template>
  <Codemirror
    v-model="code"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="4"
    :extensions="extensions"
    style="height: 100%"
  ></Codemirror>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

const code = ref('console.log("hello, world")')
const extensions = [javascript(), oneDark]
</script>

<style scoped></style>
