<template>
  <div style="height: 100%">
    <ElTable height="50vh" :data="showCourseList">
      <ElTableColumn label="课程名" prop="title"></ElTableColumn>
      <ElTableColumn label="编辑文件" width="120px">
        <template #default="scope">
          <ElButton circle :icon="Edit" @click="handleEditFileClick(scope.row.id)" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="编辑测验" width="120px">
        <template #default="scope">
          <ElButton circle :icon="Edit" @click="handleEditExamClick(scope.row.id)" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="删除课程" width="120px">
        <template #default="scope">
          <ElButton
            type="danger"
            circle
            :icon="Delete"
            @click="handleCourseDeleteClick(scope.row.id)"
          />
        </template>
      </ElTableColumn>
    </ElTable>
    <ElPagination
      style="justify-content: center"
      layout="prev, pager, next"
      :total="rawCourseList.length"
      v-model:current-page="currentPage"
    />
    <EditCourseFileDialog
      v-model="editCourseFileDialogOpen"
      :course-id="courseIdForEditFile.toString()"
    />
    <EditCourseExamDialog
      v-model="editCourseExamDialogOpen"
      :course-id="courseIdForEditExam.toString()"
    />
  </div>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import EditCourseFileDialog from './EditCourseFileDialog.vue'
import EditCourseExamDialog from './EditCourseExamDialog.vue'

interface Course {
  id: number
  title: string
}

const rawCourseList = ref<Course[]>([])
const showCourseList = computed(() => {
  const sliceStart = 10 * (currentPage.value - 1)
  const sliceEnd = 9 + 10 * (currentPage.value - 1)
  return rawCourseList.value.slice(sliceStart, sliceEnd)
})
const currentPage = ref(1)

const editCourseFileDialogOpen = ref(false)
const courseIdForEditFile = ref(0)

const editCourseExamDialogOpen = ref(false)
const courseIdForEditExam = ref(0)

//TODO: admin应该用获取全部课程
const getCourseList = async () => {
  const res = await axios.get('/api/my-course-list')
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取课程列表失败：未登录')
    return
  }

  rawCourseList.value = data.data
}

onMounted(() => {
  getCourseList()
})

const handleEditFileClick = (courseId: number) => {
  courseIdForEditFile.value = courseId
  editCourseFileDialogOpen.value = true
}

const handleEditExamClick = (courseId: number) => {
  courseIdForEditExam.value = courseId
  editCourseExamDialogOpen.value = true
}

const handleCourseDeleteClick = async (courseId: number) => {
  const res = await axios.post(`/api/delete-course`, { id: courseId })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('删除课程失败')
  } else {
    showSuccessMessge('删除课程成功')
    getCourseList()
  }
}
</script>

<style scoped></style>
