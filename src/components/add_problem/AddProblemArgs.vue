<template>
  <ElForm :inline="true" v-model="problemConfig" style="padding: 1vh 2vw">
    <ElFormItem label="函数名">
      <ElInput v-model="problemConfig.functionName"></ElInput>
    </ElFormItem>
    <ElFormItem label="返回值类型">
      <ElSelect v-model="problemConfig.returnType" style="width: 10em">
        <ElOption label="int" value="int"></ElOption>
        <ElOption label="int[]" value="int[]"></ElOption>
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
        <ElInput v-model="problemArgs[index].name"></ElInput>
      </ElFormItem>
      <ElFormItem label="参数类型">
        <ElSelect v-model="problemArgs[index].argType" style="width: 10em">
          <ElOption label="int" value="int"></ElOption>
          <ElOption label="int[]" value="int[]"></ElOption>
        </ElSelect>
      </ElFormItem>
    </ElForm>
  </template>
</template>

<script setup lang="ts">
const problemConfig = defineModel<ProblemConfig>('problemConfig', { required: true })
const problemArgs = defineModel<ProblemArgs[]>('problemArgs', { required: true })

export interface ProblemConfig {
  functionName: string
  returnType: string
  timeLimit: number
  memoryLimit: number
}

export interface ProblemArgs {
  name: string
  argType: string
}

const addArg = () => {
  problemArgs.value?.push({
    name: '',
    argType: ''
  })
}
</script>

<style scoped></style>
