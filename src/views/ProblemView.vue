<template>
  <ElSkeleton animated :rows="8" :loading="loading">
    <splitpanes class="default-theme" style="height: 89vh; padding: 0 30px 0 30px">
      <pane min-size="20" max-size="70">
        <ProblemArea :problem-id="problemId" :problem-content="problem?.content"></ProblemArea>
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

  <JudgeStatusDrawer v-model="statusDrawerOpen" :uuid="uuid"></JudgeStatusDrawer>
  <ElButton
    v-if="uuid"
    :icon="ArrowLeft"
    type="primary"
    style="position: fixed; right: 1%; top: 50%; z-index: 999"
    @click="
      () => {
        statusDrawerOpen = true
      }
    "
  ></ElButton>
</template>

<script setup lang="ts">
import ProblemArea from '@/components/problem/ProblemArea.vue'
import ProblemCodeEditor from '@/components/problem/ProblemCodeEditor.vue'
import JudgeStatusDrawer from '@/components/problem/JudgeStatusDrawer.vue'
import { runForResult, submitJudge } from '@/functions/JudgeFuntions'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getCodeTamplate, getProblem, type Problem } from '@/functions/ProblemFunctions'
import ProblemRun, { type RunCase } from '@/components/problem/ProblemRun.vue'
import { showErrorMessge } from '@/functions/utils'
import { useUserInfoStore } from '@/stores/userInfoStore'

const userInfoStore = useUserInfoStore()

const problem = ref<Problem>()
const loading = ref(true)
const code = ref('cpp')
const language = ref('')
const route = useRoute()
const problemId = ref()
const runCaseList = ref<RunCase[]>([])
const runCaseUUID = ref('')
const statusDrawerOpen = ref(false)
const uuid = ref('')

const onCodeSubmitClick = async () => {
  if (userInfoStore.getUserInfo.value == undefined) {
    showErrorMessge('未登录')
    return
  }

  let body = await submitJudge({
    problemId: problemId.value,
    language: language.value,
    code: code.value,
    type: 'normal',
    forUUID: userInfoStore.getUserInfo.value?.userId.toString()
  })

  if (body.code == 200) {
    uuid.value = body.data.uuid
  } else {
    if (body.msg != null) {
      showErrorMessge(`判题失败: ${body.msg}`)
    } else {
      showErrorMessge(`判题失败: 未知原因`)
    }
  }
}

const onRunCodeClick = async () => {
  runCaseUUID.value = await runForResult(
    problemId.value,
    language.value,
    code.value,
    runCaseList.value
  )
}

onBeforeMount(() => {
  problemId.value = route.params.id
})

const refreshSavedCode = () => {
  const lastCode = localStorage.getItem(`${problemId.value}-${language.value}`)
  if (lastCode == null) {
    if (problem.value == undefined) return
    code.value = getCodeTamplate[language.value](problem.value)
  } else {
    code.value = lastCode
  }
}

const getPRB = async () => {
  problem.value = await getProblem(problemId.value)
  loading.value = false

  refreshSavedCode()
}

onMounted(() => {
  const lastLang = localStorage.getItem('last_language')
  if (lastLang == null) {
    localStorage.setItem('last_language', 'cpp')
    language.value = 'cpp'
  } else {
    language.value = lastLang
  }

  getPRB()
})

watch(language, (newLang) => {
  localStorage.setItem('last_language', newLang)

  refreshSavedCode()
})

watch(code, (newCode) => {
  localStorage.setItem(`${problemId.value}-${language.value}`, newCode)
})

watch(uuid, () => {
  statusDrawerOpen.value = true
})
</script>

<style scoped></style>
