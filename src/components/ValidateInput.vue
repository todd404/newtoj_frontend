<template>
  <ElInput v-model="model" @input="validateInput"> </ElInput>
</template>

<script setup lang="ts">
const model = defineModel<string>({ required: true })
const validateResult = defineModel<boolean>('validateResult', { required: true })

const props = defineProps<{
  pattern: RegExp
}>()

const validateInput = (value: string) => {
  const result = props.pattern.test(value)
  validateResult.value = result
}
</script>

<style scoped></style>
