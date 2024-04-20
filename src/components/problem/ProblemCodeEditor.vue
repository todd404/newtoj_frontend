<template>
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
    style="flex-grow: 1; overflow-y: auto"
  ></Codemirror>
  <div style="width: 100%; height: 1.7rem; display: flex; justify-content: flex-end">
    <div>
      <ElButton size="small" plain @click="$emit('runCode')">运行</ElButton>
      <ElButton size="small" plain type="success" @click="$emit('submitCode')">提交</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { LanguageExtensions } from '@/functions/LanguageExtensions'

const code = defineModel<string, string>('code')
const language = defineModel<string, string>('langauge', { required: true })
const emit = defineEmits<{
  (e: 'submitCode'): void
  (e: 'runCode'): void
}>()

watch(language, (newLanguage) => {
  extensions.value = [LanguageExtensions[newLanguage](), oneDark]
})

onMounted(() => {
  extensions.value = [LanguageExtensions[language.value](), oneDark]
})
const extensions = ref()
</script>

<style scoped></style>
