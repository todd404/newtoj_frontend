<template>
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
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge } from '@/functions/utils'
import axios from 'axios'
import { onMounted, ref } from 'vue'
const props = defineProps<{ problemId: string }>()

const choiceProblemList = ref<ChoiceProblem[]>([])

export interface ChoiceProblem {
  problemContent: string
  choiceList: string[]
  answer: string
}

onMounted(() => {
  getChoiceProblemList()
})

const getChoiceProblemList = async () => {
  const res = await axios.get(`/api/choice-problem-list`, {
    params: { problemId: props.problemId }
  })

  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取选择题失败')
  } else {
    choiceProblemList.value = data.data
  }
}
</script>

<style scoped></style>
