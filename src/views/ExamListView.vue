<template>
  <div style="display: flex; width: 100%; padding: 0 10vw; gap: 10px">
    <ElCheckbox label="按结束时间排序"></ElCheckbox>
    <ElCheckbox label="隐藏已结束的测验"></ElCheckbox>
    <ElCheckbox label="隐藏已完成的测验"></ElCheckbox>
  </div>
  <ElCollapse style="margin: 0 10vw" v-if="attendExamList.length > 0">
    <ElCollapseItem v-for="(att, index) of attendExamList" :key="`att-${index}`">
      <template #title>
        <template v-if="att.type == 'course'">
          <ElText>{{ `课程：${att.title}` }}</ElText>
        </template>
      </template>

      <div
        class="exam-item"
        v-for="(exam, index) of att.attendExamItemList"
        :key="`exam-item-${index}`"
      >
        <div style="display: flex; align-items: center; gap: 10px">
          <ElIcon><EditPen /></ElIcon>
          <ElText>{{ `测验: ${exam.title}` }}</ElText>
        </div>
        <ElText type="warning">
          {{ `结束时间: ${new Date(exam.endTime).toLocaleString()}` }}</ElText
        >
        <div style="align-self: flex-end">
          <ElText v-if="exam.score != null">{{ `成绩：${exam.score}` }}</ElText>
          <ElButton v-if="exam.score == null" @click="handleStartExamClick(exam.id)"
            >开始测验</ElButton
          >
        </div>
      </div>
    </ElCollapseItem>
  </ElCollapse>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge } from '@/functions/utils'
import axios from 'axios'
import { computed, onMounted, reactive, ref } from 'vue'
import { EditPen } from '@element-plus/icons-vue'

interface AttendExam {
  type: string
  title: string
  attendExamItemList: Exam[]
}

interface Exam {
  id: number
  title: string
  endTime: string
  timeLimit: number
  score: number
}

const attendExamList = ref<AttendExam[]>([])
const filterConfig = reactive({
  endTimeSort: false,
  hiddenEnd: false,
  hiddenFinished: false
})

const handleStartExamClick = (examId: number) => {
  window.open(`/exam/${examId}`, '_blank')
}

const getAttendExamList = async () => {
  const res = await axios.get(`/api/attend-exam-list`)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取测试列表失败')
  } else {
    attendExamList.value = data.data
  }
}

onMounted(() => {
  getAttendExamList()
})
</script>

<style scoped>
.exam-item {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-around;
}
</style>
