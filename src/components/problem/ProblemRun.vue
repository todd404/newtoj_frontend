<template>
  <div style="width: 100; height: 100%; display: flex">
    <ElTabs type="border-card" style="width: 100%" v-model="tabName">
      <ElTabPane name="case" label="测试用例">
        <div style="gap: 2px; display: flex; width: 100%">
          <ElTag
            style="cursor: pointer"
            closable
            v-for="(c, index) of modelValue"
            :key="`case-tag-${index}`"
            @close="removeCase(index)"
            @click="currentCaseIndex = index"
          >
            {{ `Case ${index + 1}` }}
          </ElTag>
          <ElButton style="margin-left: 5px" size="small" circle :icon="Plus" @click="addCase" />
        </div>
        <ElSpace
          direction="vertical"
          style="padding-top: 5px; align-items: start"
          v-if="runCaseListModel.length > 0"
        >
          <template
            v-for="(arg, index) of runCaseListModel[currentCaseIndex].runArgList"
            :key="`run-case-content-${index}`"
          >
            <ElSpace>
              <ElText>{{ `${arg.argName} = ` }}</ElText>
              <ValidateInput
                v-model="arg.argContent"
                v-model:validate-result="arg.argValicated"
                :pattern="typeReg[arg.argType]"
              ></ValidateInput>
              <ElText type="danger" v-if="!arg.argValicated">请输入正确的用例</ElText>
            </ElSpace>
          </template>
        </ElSpace>
      </ElTabPane>
      <ElTabPane name="result" label="测试结果">
        <ElSkeleton :rows="3" animated :loading="resultLoading" />
        <tamplate v-if="resultList.length > 0">
          <div style="display: flex; gap: 2px">
            <ElTag
              style="cursor: pointer"
              v-for="(r, index) of resultList"
              :key="`result-tag-${index}`"
              @click="currentResultIndex = index"
            >
              {{ `结果${index + 1}` }}
            </ElTag>
          </div>

          <ElText>
            {{ resultList[currentResultIndex] }}
          </ElText>
        </tamplate>
        <tamplate v-if="resultList.length == 0 && !resultLoading">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
            "
          >
            <ElText :type="resultMsg == '请先执行代码' ? 'info' : 'danger'">
              {{ resultMsg }}
            </ElText>
          </div>
        </tamplate>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script setup lang="ts">
import type { Problem } from '@/functions/ProblemFunctions'
import { Plus } from '@element-plus/icons-vue'
import { onMounted, ref, watch } from 'vue'
import ValidateInput from '../ValidateInput.vue'
import { typeReg } from '@/functions/AddProblemFunctions'
import { getRunStatus } from '@/functions/JudgeFuntions'

const runCaseListModel = defineModel<RunCase[]>({ required: true })
const props = defineProps<{
  problem: Problem | undefined
  uuid: string
}>()
const tabName = ref('case')
const currentCaseIndex = ref(0)

const resultList = ref<string[]>([])
const resultLoading = ref(false)
const currentResultIndex = ref(0)
const resultMsg = ref('请先执行代码')

export interface RunArg {
  argName: string
  argType: string
  argContent: string
  argValicated: boolean
}

export interface RunCase {
  runArgList: RunArg[]
}

const addCase = () => {
  if (runCaseListModel.value.length >= 4) return
  let result: RunCase = {
    runArgList: []
  }

  if (props.problem == undefined) return
  for (let i = 0; i < props.problem.problemConfig.argumentNameList.length; i++) {
    result.runArgList.push({
      argName: props.problem.problemConfig.argumentNameList[i],
      argType: props.problem.problemConfig.argumentTypeList[i],
      argContent: '',
      argValicated: false
    })
  }
  runCaseListModel.value.push(result)
}

const removeCase = (index: number) => {
  runCaseListModel.value = runCaseListModel.value.filter((v, i) => index != i)
}

const refreshResult = async (uuid: string) => {
  const runStatusResponse = await getRunStatus(uuid)
  if (runStatusResponse.statusCode < 200) {
    setTimeout(() => {
      refreshResult(uuid)
    }, 1000)
    return
  }

  resultLoading.value = false
  if (runStatusResponse.statusCode > 200) {
    resultList.value = []
    resultMsg.value = runStatusResponse.msg
    return
  }

  resultList.value = runStatusResponse.runResult.split('\n').slice(0, -1)
}

watch(
  () => props.uuid,
  (newUUID) => {
    if (newUUID == '') return
    resultLoading.value = true
    refreshResult(newUUID)
    tabName.value = 'result'
  }
)

onMounted(() => {
  addCase()
})
</script>

<style scoped></style>
