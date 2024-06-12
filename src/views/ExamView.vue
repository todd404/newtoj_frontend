<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: start;
      width: 100%;
      height: 100%;
      padding: 0 50px;
    "
  >
    <ElSpace style="width: 100%; align-items: center">
      <ElSteps align-center style="width: 70vw" :active="currentProblem" finish-status="wait">
        <ElStep
          v-for="(problem, index) of problemList"
          :key="`step-${index}`"
          :title="`${index + 1}. ${problem.type == 'program' ? '编程题' : '选择题'}`"
        >
        </ElStep>
      </ElSteps>

      <ElButtonGroup>
        <ElButton
          size="small"
          type="primary"
          :icon="ArrowLeft"
          @click="onProblemMinusClick"
        ></ElButton>
        <ElButton
          size="small"
          type="primary"
          :icon="ArrowRight"
          @click="onProblemPlusClick"
        ></ElButton>
      </ElButtonGroup>

      <ElButton type="primary" @click="submitAlertDialogOpen = true"> 交卷 </ElButton>
    </ElSpace>
    <ExamProblem
      v-if="problemList.length > 0"
      :type="problemList[currentProblem].type"
      :problem-id="problemList[currentProblem].problemId.toString()"
      :exam-u-u-i-d="examUUID"
    ></ExamProblem>
  </div>

  <ElDialog v-model="submitAlertDialogOpen" title="确认" align-center>
    <ElText type="danger"
      >每一题都需要提交，每一题可多次提交取最后一次提交的分数，确认后将直接结算已得分数，是否交卷？</ElText
    >
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="submitAlertDialogOpen = false">取消</el-button>
        <el-button type="primary" @click="handleExamFinish()"> 确认 </el-button>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import ExamProblem from '@/components/exam/ExamProblem.vue'
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import axios from 'axios'
import { message } from 'ant-design-vue'
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export interface ExamItem {
  problemId: number
  type: string
  score: number
}

const route = useRoute()

const examId = ref('')
const examUUID = ref('')
const timeLimit = ref(0)
const currentProblem = ref(0)
const submitAlertDialogOpen = ref(false)
const problemList = ref<ExamItem[]>([])

const onProblemPlusClick = () => {
  if (currentProblem.value >= problemList.value.length) return

  currentProblem.value++
}

const onProblemMinusClick = () => {
  if (currentProblem.value <= 0) return

  currentProblem.value--
}

const examInit = async () => {
  const res = await axios.get(`/api/start-exam`, { params: { examId: examId.value } })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    alert(data.msg)
    window.close()
  } else {
    examUUID.value = data.data.uuid
    timeLimit.value = data.data.timeLimit
    message.info({ content: `剩余 ${timeLimit.value} 分钟`, key: 'count_down_info', duration: 0 })

    setInterval(() => {
      timeLimit.value--
      message.info({ content: `剩余 ${timeLimit.value} 分钟`, key: 'count_down_info', duration: 0 })
      if (timeLimit.value == 0) window.close()
    }, 1000 * 60)
    getExamItemList()
  }
}

const getExamItemList = async () => {
  const res = await axios.get(`/api/exam-item-list`, { params: { examId: examId.value } })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取测验信息失败')
  } else {
    problemList.value = data.data
  }
}

const handleExamFinish = async () => {
  const res = await axios.get(`/api/finish-exam`, { params: { examUUID: examUUID.value } })
  showSuccessMessge('交卷成功')
  setTimeout(() => {
    window.close()
  }, 1000)
}

onBeforeMount(() => {
  examId.value = typeof route.params.id == 'string' ? route.params.id : route.params.id[0]
})

onMounted(() => {
  examInit()
})
</script>

<style scoped></style>
