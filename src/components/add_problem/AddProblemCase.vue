<template>
  <div style="display: flex; flex-direction: column; align-items: flex-start">
    <ElSpace>
      <ElCheckbox label="自动生成用例" v-model="autoCase"></ElCheckbox>
      <span style="font-weight: bold"> 或 </span>
      <ElText type="success">上传测试用例与答案文件</ElText>
    </ElSpace>

    <template v-if="autoCase">
      <ElDivider />
      <div>
        <ElText>基本随机用例：(若无法通过基本随机用例则判零分)</ElText>
      </div>

      <ElSpace>
        <ElText>生成用例个数：</ElText>
        <ElInputNumber></ElInputNumber>

        <ElText style="padding-left: 5vw"> 基本用例分数(%) </ElText>
        <ElInputNumber></ElInputNumber>
      </ElSpace>

      <ElDivider />
      <div>
        <ElText> 用例参数设置：</ElText>
      </div>

      <template v-for="(item, index) of problemArgs" :key="`autoCase-${index}`">
        <ElSpace>
          <ElText> {{ `${item.name}: ${item.argType}` }} </ElText>
          <AddProblemCaseTypeForm :type="item.argType"></AddProblemCaseTypeForm>
        </ElSpace>
      </template>

      <ElDivider />
      <div style="display: flex; flex-direction: column; align-items: flex-start">
        <ElSpace style="padding-bottom: 1vh">
          <ElText> 额外用例：(通过对应额外用例则会加对应分数)</ElText>
          <ElButton style="margin-left: 2vw" @click="addSpecialCase">
            <ElIcon>
              <Plus />
            </ElIcon>
            添加额外用例
          </ElButton>
        </ElSpace>

        <template v-for="(item, index) of specialCases" :key="`sp-${index}`">
          <ElForm inline>
            <template v-for="(i, idx) of problemArgs" :key="`args-${idx}`">
              <ElFormItem :label="`参数${i.name}`">
                <ValidateInput
                  v-model="specialCases[index].cases[idx].content"
                  v-model:validate-result="specialCases[index].cases[idx].passed"
                  :pattern="typeReg[i.argType]"
                  style="width: 20em"
                ></ValidateInput>

                <ElText v-if="!specialCases[index].cases[idx].passed" type="danger">
                  请按格式输入
                </ElText>
              </ElFormItem>
            </template>

            <ElFormItem label="成绩占比(%)">
              <ElInputNumber
                v-model="specialCases[index].score"
                :min="0"
                :max="100"
              ></ElInputNumber>
            </ElFormItem>
          </ElForm>
        </template>
      </div>
    </template>

    <template v-if="!autoCase">
      <ElSpace>
        <ElUpload>上传测试用例</ElUpload>
        <ElUpload>上传答案</ElUpload>
      </ElSpace>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ProblemArgs } from './AddProblemArgs.vue'
import AddProblemCaseTypeForm from './AddProblemCaseTypeForm.vue'
import { Plus } from '@element-plus/icons-vue'
import { typeReg } from '@/functions/AddProblemFunctions'
import ValidateInput from '../ValidateInput.vue'

const autoCase = ref(true)
const specialCases = defineModel<SpecialCase[]>('specialCases', { required: true })

export interface Case {
  content: string
  passed: boolean
}

export interface SpecialCase {
  cases: Case[]
  score: number
}

const props = defineProps<{
  problemArgs: ProblemArgs[]
}>()

const addSpecialCase = () => {
  if (specialCases.value.length >= 8) return
  if (props.problemArgs.length == 0) return

  let caseArray: Case[] = []

  for (let i = 0; i < props.problemArgs.length; i++) {
    caseArray.push({
      content: '',
      passed: false
    })
  }

  specialCases.value.push({
    cases: caseArray,
    score: 0
  })
}
</script>

<style scoped></style>
