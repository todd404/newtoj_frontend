<template>
  <ElCollapse accordion>
    <ElCollapseItem title="问题描述">
      <AddProblemContent
        v-model:title="problemContent.title"
        v-model:content="problemContent.content"
      ></AddProblemContent>
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
        v-model:special-case-list="specialCaseList"
        v-model:auto-case-config="autoCaseConfig"
        v-model:case-upload-file="caseUploadedFile"
      ></AddProblemCase>
    </ElCollapseItem>
    <ElCollapseItem title="问题标签">
      <AddProblemTags v-model:tags="problemTags"></AddProblemTags>
    </ElCollapseItem>
    <ElCollapseItem title="正确代码">
      <ElText type="warning">
        写正确代码时确保判题参数已经确定，修改判题参数会使代码改为默认模板
      </ElText>
      <AddProblemAnswer v-model:code="code" v-model:langauge="language"></AddProblemAnswer>
    </ElCollapseItem>
    <div style="display: flex; justify-content: end; padding-top: 10px">
      <ElTooltip>
        <template #content>
          只有所有参数填写且合法才能提交<br />
          <span style="color: #fc9f4d">(特别注意分数比例之和是否为100)</span>
        </template>
        <ElButton type="primary" :disabled="!canSubmit" @click="onAddProblemSubmitClick">
          提交
        </ElButton>
      </ElTooltip>
    </div>
    <AddProblemStatusDrawer v-model="statusDrawerOpen" :uuid="uuid"></AddProblemStatusDrawer>
  </ElCollapse>
</template>

<script setup lang="ts">
import { ElCollapse } from 'element-plus'
import AddProblemContent from './AddProblemContent.vue'
import AddProblemArgs, { type PRBConfig, type ProblemArgs } from './AddProblemArgs.vue'
import AddProblemCase, {
  type AutoCaseArgConfig,
  type AutoCaseConfig,
  type SpecialCase
} from './AddProblemCase.vue'
import { computed, reactive, ref, watch } from 'vue'
import AddProblemAnswer from './AddProblemAnswer.vue'
import AddProblemTags from './AddProblemTags.vue'
import { getCppCodeTemplate } from '@/functions/CodeTemplate'
import {
  addProblem,
  type AddProblemConfig,
  type PerArgAutoCaseConfig,
  type ProblemCaseConfig,
  type ProblemConfig,
  type ScoreConfig
} from '@/functions/AddProblemFunctions'
import AddProblemStatusDrawer from './AddProblemStatusDrawer.vue'

const problemContent = reactive({
  title: '',
  content: ''
})

const problemConfig = reactive<PRBConfig>({
  functionName: '',
  functionNameValicatePassed: false,
  returnType: '',
  timeLimit: 0,
  memoryLimit: 0
})

const problemArgs = ref<ProblemArgs[]>([])

const caseUploadedFile = ref<string>('')
const autoCaseConfig = ref<AutoCaseConfig>({
  basicScore: 0,
  count: 1000,
  autoCaseArgConfigList: []
})
const specialCaseList = ref<SpecialCase[]>([])

const problemTags = ref<string[]>([])

const code = ref('')
const language = ref('cpp')

const uuid = ref('')
const statusDrawerOpen = ref(false)

watch(
  [problemConfig, problemArgs],
  ([newProblemConfig, newProblemArgs]) => {
    console.log(newProblemConfig, newProblemArgs)
    code.value = getCppCodeTemplate({
      functionName: newProblemConfig.functionName,
      returnType: newProblemConfig.returnType,
      argumentTypeList: newProblemArgs.map(({ argType }) => {
        return argType
      }),
      argumentNameList: newProblemArgs.map(({ name }) => {
        return name
      })
    })
  },
  { deep: true }
)

const canSubmit = computed<boolean>(() => {
  //问题标题和内容检查
  if (problemContent.title == '' || problemContent.content == '') return false

  //问题基本参数检查
  if (
    !problemConfig.functionNameValicatePassed ||
    problemConfig.returnType == '' ||
    problemConfig.timeLimit <= 0 ||
    problemConfig.memoryLimit <= 0
  ) {
    return false
  }

  if (problemArgs.value.length == 0) return false
  for (let arg of problemArgs.value) {
    if (arg.argType == '' || !arg.validatePassed) return false
  }

  //自动生成用例或上传用例检查
  let totalScore = 0
  totalScore += autoCaseConfig.value.basicScore
  for (let c of specialCaseList.value) {
    totalScore += c.score
  }
  if (totalScore != 100) return false

  if (caseUploadedFile.value == '') {
    if (autoCaseConfig.value.count <= 0) return false

    for (let c of specialCaseList.value) {
      for (let cc of c.perArgCases) {
        if (!cc.caseValidatePassed) return false
      }
    }

    for (let i = 0; i < problemArgs.value.length; i++) {
      const argConfig: AutoCaseArgConfig = autoCaseConfig.value.autoCaseArgConfigList[i]
      if (argConfig.itemMax < argConfig.itemMin) return false

      if (problemArgs.value[i].argType.includes('[]')) {
        if (argConfig.arrayItemNumMin <= 0) return false
        if (argConfig.arrayItemNumMax < argConfig.arrayItemNumMin) return false
      }

      if (problemArgs.value[i].argType.includes('[][]')) {
        if (argConfig.twoDimArrayItemMin <= 0) return false
        if (argConfig.twoDimArrayItemMax < argConfig.twoDimArrayItemMin) return false
      }
    }
  }

  //tags检查
  if (problemTags.value.length == 0) return false

  //正确代码检查
  if (code.value == '') return false

  return true
})

const onAddProblemSubmitClick = async () => {
  const perArgAutoCaseConfig: PerArgAutoCaseConfig[] = autoCaseConfig.value.autoCaseArgConfigList

  let specialCase: string = ''
  for (let spCase of specialCaseList.value) {
    for (let sp of spCase.perArgCases) {
      specialCase += sp.content + '\n'
    }
  }
  specialCase = specialCase.slice(0, -1)
  const problemCaseConfig: ProblemCaseConfig = {
    caseUploadedFile: caseUploadedFile.value,
    autoCaseCount: autoCaseConfig.value.count,
    perArgAutoCaseConfigList: perArgAutoCaseConfig,
    specialCase: specialCase
  }

  let specialCasesScoreList = []
  for (let spCase of specialCaseList.value) {
    specialCasesScoreList.push(spCase.score)
  }
  const scoreConfig: ScoreConfig = {
    basicCasesCount: autoCaseConfig.value.count,
    basicCasesScore: autoCaseConfig.value.basicScore,
    specialCasesScoreList
  }

  const prbConfig: ProblemConfig = {
    functionName: problemConfig.functionName,
    returnType: problemConfig.returnType,
    argumentTypeList: problemArgs.value.map((v) => v.argType),
    argumentNameList: problemArgs.value.map((v) => v.name),
    timeLimit: problemConfig.timeLimit,
    memoryLimit: problemConfig.memoryLimit,
    scoreConfig: scoreConfig
  }

  const addProblemConfig: AddProblemConfig = {
    title: problemContent.title,
    content: problemContent.content,
    code: code.value,
    language: language.value,
    problemConfig: prbConfig,
    problemCaseConfig: problemCaseConfig,
    problemTags: problemTags.value
  }

  const result = await addProblem(addProblemConfig)
  if (result.code == 200) {
    uuid.value = result.data.uuid
    statusDrawerOpen.value = true
  }
}
</script>

<style scoped></style>
