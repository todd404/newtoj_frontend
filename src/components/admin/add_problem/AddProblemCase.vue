<template>
  <div style="display: flex; flex-direction: column; align-items: flex-start">
    <ElSpace>
      <ElTooltip effect="dark" content="若参数有string类型则无法自动生成用例">
        <ElCheckbox
          label="自动生成用例"
          v-model="autoCaseMode"
          :disabled="!canAutoCase"
        ></ElCheckbox>
      </ElTooltip>
      <span style="font-weight: bold"> 或 </span>
      <ElText type="success">上传测试用例</ElText>
      <ElText type="warning"
        >（如果你设置了自动生成用例并且同时上传了测试用例，自动生成用例的配置无效）</ElText
      >
    </ElSpace>

    <template v-if="autoCaseMode">
      <ElDivider />
      <div>
        <ElText>基本随机用例：(若无法通过基本随机用例则判零分)</ElText>
      </div>

      <ElSpace>
        <ElText>生成用例个数：</ElText>
        <ElInputNumber v-model="autoCaseConfig.count"></ElInputNumber>

        <ElText style="padding-left: 5vw"> 基本用例分数(%) </ElText>
        <ElInputNumber v-model="autoCaseConfig.basicScore"></ElInputNumber>
      </ElSpace>

      <ElDivider />
      <div>
        <ElText>
          用例参数设置：(请确定判题参数设置正确再来设置，否则修改判题参数设置会导致数据丢失)</ElText
        >
      </div>

      <template v-for="(item, index) of problemArgs" :key="`autoCase-${index}`">
        <ElSpace style="align-items: center">
          <ElText> {{ `${item.name}: ${item.argType}` }} </ElText>
          <AddProblemCaseTypeForm
            :type="item.argType"
            v-model:auto-case-arg-config="autoCaseConfig.autoCaseArgConfigList[index]"
          ></AddProblemCaseTypeForm>
        </ElSpace>
        <ElDivider style="margin: 3px 0" />
      </template>

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

        <template v-for="(item, index) of specialCaseList" :key="`sp-${index}`">
          <ElForm inline>
            <ElFormItem :label="`额外用例${index + 1}：`"></ElFormItem>

            <template v-for="(i, idx) of problemArgs" :key="`args-${idx}`">
              <ElFormItem :label="`参数${i.name}`">
                <ValidateInput
                  v-model="specialCaseList[index].perArgCases[idx].content"
                  v-model:validate-result="
                    specialCaseList[index].perArgCases[idx].caseValidatePassed
                  "
                  :pattern="typeReg[i.argType]"
                  style="width: 20em"
                ></ValidateInput>

                <ElText
                  v-if="!specialCaseList[index].perArgCases[idx].caseValidatePassed"
                  type="danger"
                >
                  请输入合法的参数名
                </ElText>
              </ElFormItem>
            </template>

            <ElFormItem label="成绩占比(%)">
              <ElInputNumber
                v-model="specialCaseList[index].score"
                :min="0"
                :max="100"
              ></ElInputNumber>
            </ElFormItem>

            <ElFormItem>
              <ElButton
                type="danger"
                :icon="Delete"
                circle
                @click="deleteSpecialCase(index)"
              ></ElButton>
            </ElFormItem>
          </ElForm>
        </template>
      </div>
    </template>

    <template v-if="!autoCaseMode">
      <ElUpload
        action="/api/upload"
        :headers="{ Authorization: `Bearer ${userInfoStore.getToken.value}` }"
        :on-success="onUploadSuccess"
      >
        <template #trigger>
          <ElButton type="primary">上传测试用例</ElButton>
        </template>
      </ElUpload>

      <ElText style="padding-top: 5px; align-self: start">
        上传测试用例请确保里面的数据都是能正常解析的，建议基本用例放数千条防止作弊<br />
        评分规则为——基础用例不通过则判零分，特殊用例过一个则得对应分数<br />
        基本用例放在文件前面，特殊用例依次放在文件后面，不要有多余换行<br />
        特殊用例只有参数设置好后才能添加<br />
      </ElText>

      <ElForm v-if="caseUploadFile != ''" inline>
        <ElFormItem label="基础用例个数：">
          <ElInputNumber v-model="autoCaseConfig.count"></ElInputNumber>
        </ElFormItem>
        <ElFormItem label="基础用例分数：">
          <ElInputNumber v-model="autoCaseConfig.basicScore"></ElInputNumber>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="addSpecialCase">添加特殊用例分数</ElButton>
        </ElFormItem>
      </ElForm>

      <ElForm v-if="caseUploadFile != ''" inline>
        <template v-for="(sp, index) of specialCaseList" :key="`sp-upload-${index}`">
          <ElFormItem :label="`特殊用例分数${index + 1}`">
            <ElInputNumber v-model="sp.score"></ElInputNumber>
          </ElFormItem>
          <ElFormItem>
            <ElButton
              type="danger"
              :icon="Delete"
              circle
              @click="deleteSpecialCase(index)"
            ></ElButton>
          </ElFormItem>
        </template>
      </ElForm>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ProblemArgs } from './AddProblemArgs.vue'
import AddProblemCaseTypeForm from './AddProblemCaseTypeForm.vue'
import { Plus } from '@element-plus/icons-vue'
import { typeReg } from '@/functions/AddProblemFunctions'
import ValidateInput from '../ValidateInput.vue'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { Delete } from '@element-plus/icons-vue'

const userInfoStore = useUserInfoStore()

const autoCaseMode = ref(true)
const caseUploadedFile = defineModel<string>('caseUploadFile', { required: true })
const autoCaseConfig = defineModel<AutoCaseConfig>('autoCaseConfig', { required: true })
const specialCaseList = defineModel<SpecialCase[]>('specialCaseList', { required: true })
const canAutoCase = ref(true)
const props = defineProps<{
  problemArgs: ProblemArgs[]
}>()

const onUploadSuccess = (res: { code: number; data: { savedFileName: string } }) => {
  caseUploadedFile.value = res.code == 200 ? res.data.savedFileName : ''
}

watch(props.problemArgs, (newProblemArgs, oldProblemArgs) => {
  for (let arg of newProblemArgs) {
    if (arg.argType.includes('string')) {
      autoCaseMode.value = false
      canAutoCase.value = false

      return
    }
  }

  canAutoCase.value = true
})

export interface AutoCaseConfig {
  count: number
  basicScore: number
  autoCaseArgConfigList: AutoCaseArgConfig[]
}

export interface AutoCaseArgConfig {
  twoDimArrayItemMin: number
  twoDimArrayItemMax: number
  arrayItemNumMax: number
  arrayItemNumMin: number
  itemMin: number
  itemMax: number
}

export interface CaseForArg {
  content: string
  caseValidatePassed: boolean
}

export interface SpecialCase {
  perArgCases: CaseForArg[]
  score: number
}

watch(props.problemArgs, (newProblemArgs) => {
  let temp: AutoCaseArgConfig[] = []
  for (let i = 0; i < newProblemArgs.length; i++) {
    temp.push({
      twoDimArrayItemMax: 0,
      twoDimArrayItemMin: 0,
      arrayItemNumMax: 0,
      arrayItemNumMin: 0,
      itemMax: 0,
      itemMin: 0
    })
  }

  autoCaseConfig.value.autoCaseArgConfigList = temp
})

const addSpecialCase = () => {
  if (specialCaseList.value.length >= 8) return
  if (props.problemArgs.length == 0) return

  let caseArray: CaseForArg[] = []

  for (let i = 0; i < props.problemArgs.length; i++) {
    caseArray.push({
      content: '',
      caseValidatePassed: false
    })
  }

  specialCaseList.value.push({
    perArgCases: caseArray,
    score: 0
  })
}

const deleteSpecialCase = (index: number) => {
  specialCaseList.value = specialCaseList.value.filter((v, i) => index != i)
}
</script>

<style scoped></style>
