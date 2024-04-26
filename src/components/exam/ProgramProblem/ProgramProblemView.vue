<template>
  <ElSkeleton animated :rows="8" :loading="loading">
    <splitpanes class="default-theme" style="height: 89vh; padding: 0 30px 0 30px">
      <pane min-size="20" max-size="70">
        <ProgramProblemArea
          :problem-id="problemId"
          :problem-content="problem?.content"
        ></ProgramProblemArea>
      </pane>
      <pane>
        <Splitpanes class="default-theme" horizontal>
          <Pane size="70" style="display: flex; flex-direction: column">
            <ProblemCodeEditor
              v-model:code="code"
              v-model:langauge="language"
              @submit-code="onCodeSubmitClick"
              @run-code="onRunCodeClick"
            ></ProblemCodeEditor>
          </Pane>
          <Pane>
            <ProblemRun v-model="runCaseList" :problem="problem" :uuid="runCaseUUID"></ProblemRun>
          </Pane>
        </Splitpanes>
      </pane>
    </splitpanes>
  </ElSkeleton>
</template>

<script setup lang="ts">
import ProblemCodeEditor from '@/components/problem/ProblemCodeEditor.vue'
import { runForResult, submitJudge } from '@/functions/JudgeFuntions'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { onMounted, ref } from 'vue'
import { getCodeTamplate, getProblem, type Problem } from '@/functions/ProblemFunctions'
import ProblemRun, { type RunCase } from '@/components/problem/ProblemRun.vue'
import ProgramProblemArea from './ProgramProblemArea.vue'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'

const props = defineProps<{ problemId: string; examUUID: string }>()

const problem = ref<Problem>()
const loading = ref(true)
const code = ref('')
const language = ref('cpp')
const runCaseList = ref<RunCase[]>([])
const runCaseUUID = ref('')

const onCodeSubmitClick = async () => {
  let body = await submitJudge({
    problemId: props.problemId,
    language: language.value,
    code: code.value,
    type: 'exam',
    forUUID: props.examUUID
  })

  if (body.code != 200) {
    showErrorMessge('提交失败')
  } else {
    showSuccessMessge('提交成功')
  }
}

const onRunCodeClick = async () => {
  runCaseUUID.value = await runForResult(
    props.problemId,
    language.value,
    code.value,
    runCaseList.value
  )
}

const getPRB = async () => {
  problem.value = await getProblem(props.problemId)
  code.value = getCodeTamplate[language.value](problem.value)
  loading.value = false
}

onMounted(() => {
  getPRB()
})
</script>

<style scoped></style>
