<template>
  <ElTabs class="problem-tab" type="border-card" style="height: 100%; overflow-y: scroll">
    <ElTabPane label="问题详情">
      <ProblemContent :value="problemContent"></ProblemContent>
    </ElTabPane>
    <ElTabPane label="评论">
      <ProblemComment :problem-id="$props.problemId"></ProblemComment>
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProblemContent from './ProblemContent.vue'
import ProblemComment from './ProblemComment.vue'
import '@/assets/problem_tab.css'

const props = defineProps<{ problemId: string }>()

const problemContent = ref('')

problemContent.value = `
# Test
---
\`\`\`js
console.log(123)
\`\`\`
`
</script>

<style scoped></style>
