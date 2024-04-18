<template>
  <div class="content">
    <!-- Normal Code Blocks -->
    <!-- <div v-html="mdToHtml"></div> -->
    <!-- Add numbering to the Code Blocks -->
    <div v-html="mdToHtml" class="markdown-body"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.css'
import '@/assets/markdown.css'

const props = defineProps<{
  value: string
}>()

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  })
)

const mdToHtml = computed(() => {
  const mdhtml = marked.parse(props.value)
  return mdhtml
})
</script>

<style scoped></style>
