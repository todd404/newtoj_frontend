<template>
  <ElCard class="add-choice-problem">
    <ElSpace style="width: 100%; justify-content: center; margin-bottom: 10px">
      <ElText>问题集标题:</ElText>
      <ElInput style="width: 50vw" v-model="problemTitle"></ElInput>
      <ElButton type="primary" @click="onSubmitClick">提交问题</ElButton>
    </ElSpace>

    <ElAffix :offset="20" :z-index="99999">
      <ElSpace style="width: 100%; justify-content: center">
        <ElText>问题内容：</ElText>
        <ElInput type="textarea" v-model="addProblemContent" style="width: 50vw"></ElInput>
        <ElButton type="primary" @click="onAddProblemClick">添加问题</ElButton>
      </ElSpace>
    </ElAffix>

    <ElDivider><ElText style="color: #c73e3a">选中的选项即设置的答案</ElText></ElDivider>

    <ElSpace direction="vertical" style="align-items: start; overflow-y: auto" :size="48">
      <template v-for="(problem, index) of problemList" :key="`choice-problem-${index}`">
        <ElSpace direction="vertical" style="align-items: start; padding: 0 20px">
          <div>
            <ElText>{{ `${index + 1}. ${problem.problemContent}` }}</ElText>
            <ElButton
              :icon="Delete"
              type="danger"
              size="small"
              @click="onRemoveProblemClick(index)"
              style="margin-left: 20px"
            >
              删除当前题目
            </ElButton>
          </div>

          <ElSpace>
            <ElText style="padding-left: 10px">添加选项:</ElText>
            <ElInput style="width: 20vw" v-model="problem.addingChoice"></ElInput>
            <ElButton
              @click="onAddChoiceClick(index)"
              circle
              type="primary"
              :icon="Plus"
              size="small"
            ></ElButton>

            <ElButton :icon="Close" type="danger" size="small" @click="onRemoveChoiceClick(index)">
              删除当前选项
            </ElButton>
          </ElSpace>
          <ElRadioGroup v-model="problem.answer" style="display: table">
            <div v-for="(choice, idx) of problem.choiceList" :key="`prblem-${index}-choice-${idx}`">
              <ElRadio :value="String.fromCharCode(65 + idx)">{{ choice }}</ElRadio>
            </div>
          </ElRadioGroup>
        </ElSpace>
      </template>
    </ElSpace>
    <ElBacktop :bottom="100" />
  </ElCard>
</template>

<script setup lang="ts">
import { type ChoiceProblem } from '@/components/exam/ChoiceProblem/ChoiceProblem.vue'
import { ref } from 'vue'
import { Plus, Delete, Close } from '@element-plus/icons-vue'
import { showErrorMessge } from '@/functions/utils'
import {
  addChoiceProblem,
  type AddChoiceProblemRequest
} from '@/functions/AddChoiceProblemFunctions'

const problemTitle = ref<string>('')
const problemList = ref<AddingChoiceProblem[]>([])
const addProblemContent = ref<string>('')

interface AddingChoiceProblem extends ChoiceProblem {
  addingChoice: string
}

const onAddProblemClick = () => {
  if (addProblemContent.value == '') return
  problemList.value.push({
    problemContent: addProblemContent.value,
    choiceList: [],
    answer: '',
    addingChoice: ''
  })

  addProblemContent.value = ''
}

const onRemoveProblemClick = (index: number) => {
  problemList.value = problemList.value.filter((v, i) => index != i)
}

const onAddChoiceClick = (index: number) => {
  if (problemList.value[index].addingChoice == '') return

  const option = String.fromCharCode(65 + problemList.value[index].choiceList.length)
  problemList.value[index].choiceList.push(`${option}. ${problemList.value[index].addingChoice}`)

  problemList.value[index].addingChoice = ''
}

const onRemoveChoiceClick = (index: number) => {
  const idx = problemList.value[index].answer.charCodeAt(0) - 65
  problemList.value[index].answer = ''
  problemList.value[index].choiceList = problemList.value[index].choiceList.filter(
    (v, i) => i != idx
  )

  problemList.value[index].choiceList = problemList.value[index].choiceList.map((v, i) => {
    const sliceStr = v.substring(1)
    const option = String.fromCharCode(65 + i)
    return `${option}${sliceStr}`
  })
}

const onSubmitClick = () => {
  if (problemTitle.value == '') {
    showErrorMessge('请输入标题')
    return
  }

  if (problemList.value.length == 0) {
    showErrorMessge('问题合集为空')
    return
  }

  for (let i = 0; i < problemList.value.length; i++) {
    if (problemList.value[i].choiceList.length == 0) {
      showErrorMessge(`第${i + 1}道题没有设置选项`)
      return
    }

    if (problemList.value[i].answer == '') {
      showErrorMessge(`第${i + 1}道题没有选答案`)
      return
    }
  }

  const addChoiceProblemRequest: AddChoiceProblemRequest = {
    title: problemTitle.value,
    choiceProblemList: problemList.value
  }
  addChoiceProblem(addChoiceProblemRequest)
}
</script>

<style scoped></style>
