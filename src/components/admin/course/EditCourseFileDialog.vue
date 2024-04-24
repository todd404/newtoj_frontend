<template>
  <ElDialog v-model="dialogOpenModel">
    <div style="display: flex; justify-content: space-between">
      <ElText style="color: #fb9966">文件将以文件名进行排列，上传文件名重复的文件将覆盖</ElText>
      <ElUpload
        style="display: flex; align-items: center"
        :show-file-list="false"
        :action="`/api/upload-course-file`"
        :data="{ courseId }"
        :headers="{ Authorization: `Bearer ${userInfoStore.getToken.value}` }"
        :on-success="handleUploadSuccess"
      >
        <ElButton>上传</ElButton>
      </ElUpload>
    </div>
    <ElTable :data="courseFileList">
      <ElTableColumn label="文件类型" width="120px">
        <template #default="scope">
          <ElText v-if="scope.row.fileType == 'video'"> 视频 </ElText>
          <ElText v-if="scope.row.fileType != 'video'"> 其他 </ElText>
        </template>
      </ElTableColumn>
      <ElTableColumn label="文件名" prop="file"></ElTableColumn>
      <ElTableColumn label="删除" width="56px">
        <template #default="scope">
          <ElButton circle :icon="Delete" @click="handleFileDelteClick(scope.row.id)" />
        </template>
      </ElTableColumn>
    </ElTable>
  </ElDialog>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'
import axios from 'axios'
import { ref, watch } from 'vue'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { Delete } from '@element-plus/icons-vue'

interface CourseFile {
  id: number
  file: string
  fileType: string
}

const dialogOpenModel = defineModel<boolean>({ required: true })
const props = defineProps<{
  courseId: string
}>()
const courseFileList = ref<CourseFile[]>([])
const userInfoStore = useUserInfoStore()

const getCourseFileList = async () => {
  const res = await axios.get(`/api/course-file-list`, { params: { courseId: props.courseId } })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取文件列表失败')
  } else {
    courseFileList.value = data.data
    courseFileList.value = courseFileList.value.sort((a, b) => a.file.localeCompare(b.file))
  }
}

const handleUploadSuccess = (response: any) => {
  if (response.code != 200) {
    showErrorMessge('上传失败')
  } else {
    showSuccessMessge('上传成功')
    getCourseFileList()
  }
}

const handleFileDelteClick = async (courseFileId: number) => {
  const res = await axios.post(`/api/delete-course-file`, {
    id: courseFileId,
    courseId: props.courseId
  })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('删除文件失败')
  } else {
    showSuccessMessge('删除文件成功')
    getCourseFileList()
  }
}

watch(dialogOpenModel, (newOpenValue) => {
  if (newOpenValue == true) {
    getCourseFileList()
  }
})
</script>

<style scoped></style>
