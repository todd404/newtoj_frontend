<template>
  <div style="display: flex; width: 100%; padding: 0 10vw; gap: 10px">
    <ElCheckbox label="按结束时间排序" v-model="filterConfig.endTimeSort"></ElCheckbox>
    <ElCheckbox label="隐藏已结束的测验" v-model="filterConfig.hiddenEnd"></ElCheckbox>
    <ElCheckbox label="隐藏已完成的测验" v-model="filterConfig.hiddenFinished"></ElCheckbox>
    <ElCheckbox label="只显示课程" v-model="filterConfig.onlyCourse"></ElCheckbox>
    <ElCheckbox label="只显示招聘" v-model="filterConfig.onlyJob"></ElCheckbox>
  </div>
  <ElCollapse style="margin: 0 10vw" v-if="attendExamList.length > 0">
    <ElCollapseItem v-for="(att, index) of configedAttendExamList" :key="`att-${index}`">
      <template #title>
        <template v-if="att.type == 'course'">
          <ElText>{{ `课程：${att.title}` }}</ElText>
        </template>
        <template v-if="att.type == 'job'">
          <ElText>{{ `招聘：${att.title}` }}</ElText>
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
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

const filterConfig = reactive({
  endTimeSort: false,
  hiddenEnd: false,
  hiddenFinished: false,
  onlyCourse: false,
  onlyJob: false
})

const attendExamList = ref<AttendExam[]>([])
const configedAttendExamList = computed<AttendExam[]>(() => {
  let sortedList
  if (filterConfig.endTimeSort) {
    sortedList = attendExamList.value.map((v) => {
      v.attendExamItemList.sort(
        (a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
      )
      return {
        ...v,
        closeTime:
          v.attendExamItemList[0] != undefined
            ? new Date(v.attendExamItemList[0].endTime).getTime()
            : 99999999999999
      }
    })

    return sortedList.sort((a, b) => {
      return a.closeTime - b.closeTime
    })
  } else {
    sortedList = attendExamList.value
  }

  if (filterConfig.hiddenEnd) {
    sortedList = sortedList.map((v) => {
      let filteredExamList = v.attendExamItemList.filter(
        (v) => new Date(v.endTime).getTime() > new Date().getTime()
      )

      return {
        ...v,
        attendExamItemList: filteredExamList
      }
    })
  }

  if (filterConfig.hiddenFinished) {
    sortedList = sortedList.map((v) => {
      let filteredExamList = v.attendExamItemList.filter((v) => v.score == null)

      return {
        ...v,
        attendExamItemList: filteredExamList
      }
    })
  }

  if (filterConfig.onlyCourse) {
    sortedList = sortedList.filter((v) => v.type == 'course')
  }

  if (filterConfig.onlyJob) {
    sortedList = sortedList.filter((v) => v.type == 'job')
  }

  return sortedList
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

watch(
  [() => filterConfig.onlyCourse, () => filterConfig.onlyJob],
  ([newOnlyCourse, newOnlyJob], [prevOnlyCourse, prevOnlyJob]) => {
    if (newOnlyCourse && prevOnlyJob) {
      filterConfig.onlyCourse = true
      filterConfig.onlyJob = false
      return
    }

    if (newOnlyJob && prevOnlyCourse) {
      filterConfig.onlyJob = true
      filterConfig.onlyCourse = false
      return
    }
  }
)
</script>

<style scoped>
.exam-item {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-around;
}
</style>
