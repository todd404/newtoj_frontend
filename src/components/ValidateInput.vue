<template>
  <ElInput v-model="model" @input="validateInput"> </ElInput>
</template>

<script setup lang="ts">
const model = defineModel<string>({ required: true })
const validateResult = defineModel<boolean>('validateResult', { required: true })

export type validateFunction = (arg0: string) => boolean

const props = defineProps<{
  pattern: RegExp | validateFunction
}>()

const validateInput = (value: string) => {
  let result
  if (props.pattern instanceof RegExp) result = props.pattern.test(value)
  else result = props.pattern(value)
  validateResult.value = result
}
</script>

<style scoped></style>
