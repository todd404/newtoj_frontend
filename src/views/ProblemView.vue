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
            ></ProblemCodeEditor>
          </Pane>
          <Pane></Pane>
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
import { submitJudge } from '@/functions/JudgeFuntions'
import { ElMessage } from 'element-plus'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getProblem, type Problem } from '@/functions/ProblemFunctions'

const problem = ref<Problem>()
const loading = ref(true)
const code = ref('cpp')
const language = ref('')
const route = useRoute()
const problemId = ref()
const statusDrawerOpen = ref(false)
const uuid = ref('')

const onCodeSubmitClick = async () => {
  let body = await submitJudge({
    problemId: problemId.value,
    language: language.value,
    code: code.value
  })

  if (body.code == 200) {
    uuid.value = body.data.uuid
  } else {
    if (body.msg != null) {
      ElMessage({
        type: 'error',
        message: `判题失败: ${body.msg}`
      })
    } else {
      ElMessage({
        type: 'error',
        message: '判题失败: 未知错误'
      })
    }
  }
}

onBeforeMount(() => {
  problemId.value = route.params.id
})

const refreshSavedCode = () => {
  const lastCode = localStorage.getItem(`${problemId.value}-${language.value}`)
  if (lastCode == null) {
    //TODO: 使用模板
  } else {
    code.value = lastCode
  }
}

const getPRB = async () => {
  problem.value = await getProblem(problemId.value)
  refreshSavedCode()
  loading.value = false
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
