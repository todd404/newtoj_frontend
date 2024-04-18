<template>
  <ElForm inline style="padding-top: 16px">
    <template v-if="!type.includes('[]')">
      <ElFormItem label="最小值">
        <ElInputNumber v-model="autoCaseArgConfig.itemMin"></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="最大值">
        <ElInputNumber v-model="autoCaseArgConfig.itemMax"></ElInputNumber>
      </ElFormItem>
    </template>

    <template v-if="type.includes('[]') && !type.includes('[][]')">
      <ElFormItem label="元素最小值">
        <ElInputNumber v-model="autoCaseArgConfig.itemMin"></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="元素最大值">
        <ElInputNumber v-model="autoCaseArgConfig.itemMax"></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="最小元素个数">
        <ElInputNumber v-model="autoCaseArgConfig.arrayItemNumMin"></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="最大元素个数">
        <ElInputNumber v-model="autoCaseArgConfig.arrayItemNumMax"></ElInputNumber>
      </ElFormItem>
    </template>

    <template v-if="type.includes('[][]')">
      <ElFormItem label="元素最小值">
        <ElInputNumber v-model="autoCaseArgConfig.itemMin"></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="元素最大值">
        <ElInputNumber v-model="autoCaseArgConfig.itemMax"></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="最小数组元素个数">
        <ElInputNumber v-model="autoCaseArgConfig.arrayItemNumMin"></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="最大数组元素个数">
        <ElInputNumber v-model="autoCaseArgConfig.arrayItemNumMax"></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="最小数组个数">
        <ElInputNumber v-model="autoCaseArgConfig.twoDimArrayItemMin"></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="最大数组个数">
        <ElInputNumber v-model="autoCaseArgConfig.twoDimArrayItemMax"></ElInputNumber>
      </ElFormItem>
    </template>
  </ElForm>
</template>

<script setup lang="ts">
import type { AutoCaseArgConfig } from './AddProblemCase.vue'

const autoCaseArgConfig = defineModel<AutoCaseArgConfig>('autoCaseArgConfig', { required: true })
const props = defineProps<{
  type: string
}>()
</script>

<style scoped></style>
