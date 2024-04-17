<template>
  <ElForm :inline="true" v-model="problemConfig" style="padding: 1vh 2vw">
    <ElFormItem label="函数名">
      <ValidateInput
        v-model="problemConfig.functionName"
        v-model:validate-result="problemConfig.functionNameValicatePassed"
        :pattern="/^[a-zA-Z_][a-zA-Z0-9_]*$/"
      ></ValidateInput>

      <ElText v-if="!problemConfig.functionNameValicatePassed" type="danger">
        请输入合法的函数名
      </ElText>
    </ElFormItem>
    <ElFormItem label="返回值类型">
      <ElSelect v-model="problemConfig.returnType" style="width: 10em">
        <ElOption label="int" value="int"></ElOption>
        <ElOption label="int[]" value="int[]"></ElOption>
        <ElOption label="int[][]" value="int[][]"></ElOption>
        <ElOption label="string" value="string"></ElOption>
      </ElSelect>
    </ElFormItem>
    <ElFormItem label="时间限制(s)">
      <ElInputNumber
        :min="10"
        :max="600"
        v-model="problemConfig.timeLimit"
        :controls="false"
      ></ElInputNumber>
    </ElFormItem>
    <ElFormItem label="内存限制(KB)">
      <ElInputNumber
        :min="128"
        :max="1024000"
        v-model="problemConfig.memoryLimit"
        :controls="false"
      ></ElInputNumber>
    </ElFormItem>
  </ElForm>

  <ElDivider />

  <div style="display: flex; justify-content: space-between; align-items: center; padding: 1vh 2vw">
    <span style="width: 6em; text-align: center">函数参数：</span>
    <ElButton style="align-self: flex-end" @click="addArg"> 添加参数 </ElButton>
  </div>

  <template v-for="(item, index) of problemArgs" :key="index">
    <ElForm inline v-model="problemArgs[index]" style="padding: 1vh 2vw">
      <ElFormItem label="参数名">
        <ValidateInput
          v-model="problemArgs[index].name"
          v-model:validate-result="problemArgs[index].validatePassed"
          :pattern="/^[a-zA-Z_][a-zA-Z0-9_]*$/"
        ></ValidateInput>
        <ElText v-if="!problemArgs[index].validatePassed" type="danger">请输入合法参数名</ElText>
      </ElFormItem>
      <ElFormItem label="参数类型">
        <ElSelect v-model="problemArgs[index].argType" style="width: 10em">
          <ElOption label="int" value="int"></ElOption>
          <ElOption label="int[]" value="int[]"></ElOption>
          <ElOption label="int[][]" value="int[][]"></ElOption>
          <ElOption label="string" value="string"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem>
        <ElButton circle type="danger" :icon="Delete" @click="deleteArg(index)"></ElButton>
      </ElFormItem>
    </ElForm>
  </template>
</template>

<script setup lang="ts">
import ValidateInput from '../ValidateInput.vue'
import { Delete } from '@element-plus/icons-vue'

const problemConfig = defineModel<PRBConfig>('problemConfig', { required: true })
const problemArgs = defineModel<ProblemArgs[]>('problemArgs', { required: true })

export interface PRBConfig {
  functionName: string
  functionNameValicatePassed: boolean
  returnType: string
  timeLimit: number
  memoryLimit: number
}

export interface ProblemArgs {
  name: string
  argType: string
  validatePassed: boolean
}

const addArg = () => {
  problemArgs.value?.push({
    name: '',
    argType: '',
    validatePassed: false
  })
}

const deleteArg = (index: number) => {
  problemArgs.value = problemArgs.value.filter((v, i) => index != i)
}
</script>

<style scoped></style>
