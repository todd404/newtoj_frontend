<template>
  <ElDialog v-model="dialogOpenModel" witdh="50vw">
    <ElTable :data="examEditTableData">
      <ElTableColumn label="测验标题" prop="title"></ElTableColumn>
      <ElTableColumn label="开始时间">
        <template #default="scope">
          <ElText type="success">{{ scope.row.startTime }}</ElText>
        </template>
      </ElTableColumn>
      <ElTableColumn label="结束时间">
        <template #default="scope">
          <ElText type="warning">{{ scope.row.endTime }}</ElText>
        </template>
      </ElTableColumn>
      <ElTableColumn label="选中">
        <template #default="scope">
          <ElButton
            v-if="!scope.row.isSelected"
            type="primary"
            :icon="Select"
            @click="handleExamSelectClick(scope.row.examId)"
            >选中</ElButton
          >
          <ElButton
            v-if="scope.row.isSelected"
            type="danger"
            :icon="CloseBold"
            @click="handleExamUnSelectClick(scope.row.examId)"
            >取消选中</ElButton
          >
        </template>
      </ElTableColumn>
    </ElTable>
  </ElDialog>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'
import axios from 'axios'
import { computed, ref, watch } from 'vue'
import { Select, CloseBold } from '@element-plus/icons-vue'
import { id } from 'element-plus/es/locale/index.mjs'

interface Exam {
  id: number
  userId: number
  title: string
  startTime: Date
  endTime: Date
  timeLimit: number
}

interface CourseExam {
  id: number
  courseId: string
  examId: string
}

interface ExamEditTableItem {
  examId: number
  title: string
  startTime: string
  endTime: string
  isSelected: boolean
}

const dialogOpenModel = defineModel<boolean>({ required: true })
const props = defineProps<{
  courseId: string
}>()

const examList = ref<Exam[]>([])
const courseExamList = ref<CourseExam[]>([])
const examEditTableData = computed<ExamEditTableItem[]>(() =>
  examList.value.map((v) => {
    let isSelected = true
    if (courseExamList.value.find((value) => value.examId == v.id.toString())) {
      isSelected = true
    } else {
      isSelected = false
    }

    return {
      examId: v.id,
      title: v.title,
      startTime: new Date(v.startTime).toLocaleString(),
      endTime: new Date(v.endTime).toLocaleString(),
      isSelected
    }
  })
)

const getExamList = async () => {
  const res = await axios.get(`/api/my-exam-list`)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取测验列表失败')
  } else {
    examList.value = data.data
  }
}

const getCourseExam = async () => {
  const res = await axios.get(`/api/course-exam-list`, { params: { courseId: props.courseId } })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取测验信息失败')
  } else {
    courseExamList.value = data.data
  }
}

const handleExamSelectClick = async (examId: number) => {
  const req: CourseExam = {
    id: 0,
    courseId: props.courseId,
    examId: examId.toFixed()
  }

  const res = await axios.post(`/api/add-course-exam`, req)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('选中测验失败')
  } else {
    showSuccessMessge('选中测验成功')
    getCourseExam()
  }
}

const handleExamUnSelectClick = async (examId: number) => {
  const req: CourseExam = {
    id: 0,
    courseId: props.courseId,
    examId: examId.toFixed()
  }

  const res = await axios.post(`/api/delete-course-exam`, req)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('取消选中测验失败')
  } else {
    showSuccessMessge('取消选中测验成功')
    getCourseExam()
  }
}

watch(dialogOpenModel, (newOpenValue) => {
  if (newOpenValue == true) {
    getExamList()
    getCourseExam()
  }
})
</script>

<style scoped></style>
