<template>
  <ElCard style="margin: 20px 50px">
    <ElSpace direction="vertical" style="align-items: start" :size="32">
      <template v-for="(problem, index) of modelValue" :key="`choice-problem-${index}`">
        <ElSpace direction="vertical" style="align-items: start; padding: 0 20px">
          <ElText>{{ `${index + 1}. ${problem.problemContent}` }}</ElText>
          <ElRadioGroup v-model="problem.answer" style="display: table">
            <div v-for="(choice, idx) of problem.choiceList" :key="`prblem-${index}-choice-${idx}`">
              <ElRadio :value="String.fromCharCode(65 + idx)">{{ choice }}</ElRadio>
            </div>
          </ElRadioGroup>
        </ElSpace>
      </template>
    </ElSpace>
  </ElCard>
</template>

<script setup lang="ts">
const model = defineModel<ChoiceProblem[]>({ required: true })

export interface ChoiceProblem {
  problemContent: string
  choiceList: string[]
  answer: string
}
</script>

<style scoped></style>
