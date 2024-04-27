<template>
  <div style="height: 100%">
    <ElTable height="50vh" :data="showJobList">
      <ElTableColumn label="招聘内容" prop="title"></ElTableColumn>
      <ElTableColumn label="编辑测验" width="120px">
        <template #default="scope">
          <ElButton circle :icon="Edit" @click="handleEditExamClick(scope.row.id)" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="删除招聘" width="120px">
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
      :total="rawJobList.length"
      v-model:current-page="currentPage"
    />

    <EditJobExamDialog v-model="editJobExamDialogOpen" :job-id="jobIdForEditExam.toString()" />
  </div>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import EditJobExamDialog from './EditJobExamDialog.vue'

interface Job {
  id: number
  title: string
}

const rawJobList = ref<Job[]>([])
const showJobList = computed(() => {
  const sliceStart = 10 * (currentPage.value - 1)
  const sliceEnd = 9 + 10 * (currentPage.value - 1)
  return rawJobList.value.slice(sliceStart, sliceEnd)
})
const currentPage = ref(1)

const editJobExamDialogOpen = ref(false)
const jobIdForEditExam = ref(0)

//TODO: admin应该用获取全部课程
const getJobList = async () => {
  const res = await axios.get('/api/my-job-list')
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取招聘列表失败：未登录')
    return
  }

  rawJobList.value = data.data
}

onMounted(() => {
  getJobList()
})

const handleEditExamClick = (courseId: number) => {
  jobIdForEditExam.value = courseId
  editJobExamDialogOpen.value = true
}

const handleCourseDeleteClick = async (courseId: number) => {
  const res = await axios.post(`/api/delete-course`, { id: courseId })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('删除招聘失败')
  } else {
    showSuccessMessge('删除招聘成功')
    getJobList()
  }
}
</script>

<style scoped></style>
