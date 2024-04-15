<template>
  <ElCollapse accordion>
    <ElCollapseItem title="问题描述">
      <AddProblemContent></AddProblemContent>
    </ElCollapseItem>
    <ElCollapseItem title="判题参数">
      <AddProblemArgs
        v-model:problem-config="problemConfig"
        v-model:problem-args="problemArgs"
      ></AddProblemArgs>
    </ElCollapseItem>
    <ElCollapseItem title="判题用例">
      <AddProblemCase
        :problem-args="problemArgs"
        v-model:special-cases="specialCases"
      ></AddProblemCase>
    </ElCollapseItem>
  </ElCollapse>
</template>

<script setup lang="ts">
import { ElCollapse } from 'element-plus'
import AddProblemContent from './AddProblemContent.vue'
import AddProblemArgs, { type ProblemConfig, type ProblemArgs } from './AddProblemArgs.vue'
import AddProblemCase, { type SpecialCase } from './AddProblemCase.vue'
import { reactive, ref } from 'vue'

const problemConfig = reactive<ProblemConfig>({
  functionName: '',
  returnType: '',
  timeLimit: 0,
  memoryLimit: 0
})

const problemArgs = ref<ProblemArgs[]>([])

const specialCases = ref<SpecialCase[]>([])
</script>

<style scoped></style>
