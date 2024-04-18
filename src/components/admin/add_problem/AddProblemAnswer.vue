<template>
  <div>
    <ElSelect v-model="language" style="width: 100px" size="small">
      <ElOption label="C++" value="cpp" />
      <ElOption label="Java" value="java" />
    </ElSelect>
    <ElDivider style="margin: 0"></ElDivider>
    <Codemirror
      v-model="code"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="4"
      :extensions="extensions"
      style="height: 50vh"
    ></Codemirror>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { LanguageExtensions } from '@/functions/LanguageExtensions'

const code = defineModel<string, string>('code', { required: true })
const language = defineModel<string, string>('langauge', { required: true })

onMounted(() => {
  extensions.value = [LanguageExtensions[language.value](), oneDark]
})

watch(language, (newLanguage) => {
  if (newLanguage == undefined) return
  extensions.value = [LanguageExtensions[newLanguage](), oneDark]
})
const extensions = ref()
</script>

<style scoped></style>
