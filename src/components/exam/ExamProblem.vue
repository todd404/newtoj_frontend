<template>
  <ProgramProblemView v-if="type == 'program'" :problem-id="problemId"></ProgramProblemView>
  <ChoiceProblem v-if="type == 'choice'" :problem-id="problemId"></ChoiceProblem>
</template>

<script setup lang="ts">
import ProgramProblemView from './ProgramProblem/ProgramProblemView.vue'
import ChoiceProblem from './ChoiceProblem/ChoiceProblem.vue'

const props = defineProps<{ type: string; problemId: string }>()
</script>

<style scoped></style>
