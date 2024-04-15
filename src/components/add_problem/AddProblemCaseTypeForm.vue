<template>
  <ElForm inline>
    <template v-if="type == 'int'">
      <ElFormItem label="最小值">
        <ElInputNumber></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="最大值">
        <ElInputNumber></ElInputNumber>
      </ElFormItem>
    </template>

    <template v-if="type == 'int[]'">
      <ElFormItem label="最小值">
        <ElInputNumber></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="最大值">
        <ElInputNumber></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="最小元素个数">
        <ElInputNumber></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="最大元素个数">
        <ElInputNumber></ElInputNumber>
      </ElFormItem>
    </template>
  </ElForm>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: string
}>()
</script>

<style scoped></style>
