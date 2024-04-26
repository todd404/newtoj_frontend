<template>
  <ElButton type="danger" plain style="margin: 20px 50px" @click="handleSubmitClick()"
    >提交本页选择题(可多次提交)</ElButton
  >
  <ElCard style="margin: 20px 50px">
    <ElSpace direction="vertical" style="align-items: start" :size="32">
      <template v-for="(problem, index) of choiceProblemList" :key="`choice-problem-${index}`">
        <ElSpace direction="vertical" style="align-items: start; padding: 0 20px">
          <ElText>{{ `${index + 1}. ${problem.problemContent}` }}</ElText>
          <ElRadioGroup v-model="problem.answer" style="display: table">
            <div v-for="(choice, idx) of problem.choiceList" :key="`prblem-${index}-choice-${idx}`">
              <ElRadio :value="String.fromCharCode(65 + idx)">{{ choice }}</ElRadio>
            </div>
          </ElRadioGroup>
        </ElSpace>
      </template>
    </ElSpace>
  </ElCard>
  <ElButton type="danger" plain style="margin: 20px 50px" @click="handleSubmitClick()"
    >提交本页选择题(可多次提交)</ElButton
  >
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'
import axios from 'axios'
import { onMounted, ref } from 'vue'
const props = defineProps<{ problemId: string; examUUID: string }>()

const choiceProblemList = ref<ChoiceProblem[]>([])

export interface ChoiceProblem {
  problemContent: string
  choiceList: string[]
  answer: string
}

interface JudgeChoiceProblemRequest {
  examUUID: string
  choiceProblemId: string
  answerList: string[]
}

const handleSubmitClick = async () => {
  let judgeChoiceProblemRequest: JudgeChoiceProblemRequest = {
    examUUID: props.examUUID,
    choiceProblemId: props.problemId,
    answerList: []
  }

  judgeChoiceProblemRequest.answerList = choiceProblemList.value.map((v) => v.answer)

  const res = await axios.post(`/api/judge-choice-problem`, judgeChoiceProblemRequest)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('提交失败')
  } else {
    showSuccessMessge('提交成功')
  }
}

const getChoiceProblemList = async () => {
  const res = await axios.get(`/api/choice-problem`, {
    params: { problemId: props.problemId }
  })

  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取选择题失败')
  } else {
    choiceProblemList.value = data.data
  }
}

onMounted(() => {
  getChoiceProblemList()
})
</script>

<style scoped></style>
