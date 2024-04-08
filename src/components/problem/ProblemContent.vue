<template>
  <div class="content">
    <!-- Normal Code Blocks -->
    <!-- <div v-html="mdToHtml"></div> -->
    <!-- Add numbering to the Code Blocks -->
    <div v-html="mdToHtml" class="standard"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.css'

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

<style scoped>
.standard h1 {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}
.standard h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.83em 0;
}
.standard h3 {
  font-size: 1.17em;
  font-weight: bold;
  margin: 1em 0;
}
.standard p {
  margin: 1em 0;
}
.standard ul,
.standard ol {
  display: block;
  list-style-type: disc;
  padding-left: 40px;
  margin: 1em 0;
}
.standard ol {
  list-style-type: decimal;
}
.standard li {
  display: list-item;
}
.standard blockquote {
  margin: 1em 40px;
}
.standard pre {
  margin: 1em 0;
  white-space: pre;
}
</style>
