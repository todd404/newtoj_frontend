<template>
  <ElTabs class="problem-tab" type="border-card" style="height: 100%; overflow-y: auto">
    <ElTabPane label="问题详情">
      <ProblemContent :value="content"></ProblemContent>
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
import '@/assets/problem_tab.css'
import ProblemContent from '@/components/problem/ProblemContent.vue'
import { computed } from 'vue'

const props = defineProps<{ problemId: string; problemContent: string | undefined }>()
const content = computed(() => {
  if (props.problemContent == undefined) return ''
  else return props.problemContent
})
</script>

<style scoped></style>
