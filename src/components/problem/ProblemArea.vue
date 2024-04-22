<template>
  <ElTabs class="problem-tab" type="border-card" style="height: 100%; overflow-y: auto">
    <ElTabPane label="问题详情">
      <ProblemContent :value="content"></ProblemContent>
    </ElTabPane>
    <ElTabPane label="评论">
      <ProblemComment :problem-id="$props.problemId"></ProblemComment>
    </ElTabPane>
    <ElTabPane label="判题历史">
      <JudgeHistoryTable :problem-id="$props.problemId"></JudgeHistoryTable>
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
import ProblemContent from './ProblemContent.vue'
import ProblemComment from './ProblemComment.vue'
import '@/assets/problem_tab.css'
import { computed } from 'vue'
import JudgeHistoryTable from './JudgeHistoryTable.vue'

const props = defineProps<{ problemId: string; problemContent: string | undefined }>()
const content = computed(() => {
  if (props.problemContent == undefined) return ''
  else return props.problemContent
})
</script>

<style scoped></style>
