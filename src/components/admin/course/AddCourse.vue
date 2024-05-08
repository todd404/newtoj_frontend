<template>
  <div style="display: flex; flex-direction: column; align-items: center">
    <div style="display: flex; align-items: center; gap: 10px">
      <ElText>课程标题： </ElText>
      <ElInput style="width: 40rem" v-model="addCourseRequest.title"></ElInput>
      <ElButton type="primary" @click="handleSubmitClick">提交</ElButton>
    </div>
    <div style="display: flex; width: 100%; justify-content: center; margin-top: 20px">
      <ElUpload
        ref="upload"
        action="/api/upload"
        :limit="1"
        accept=".jpg, .jpeg, .png, .webp, .avif"
        :before-upload="handleBeforeCoverUpload"
        :headers="{ Authorization: `Bearer ${userInfoStore.getToken.value}` }"
        drag
        list-type="picture"
        style="width: 80%"
        :on-exceed="handleExceed"
        :on-success="handleUploadSuccess"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽课程封面到这 或 <em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
        </template>
      </ElUpload>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { UploadFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { el } from 'element-plus/es/locale/index.mjs'
import { reactive, ref } from 'vue'
interface AddCourseRequest {
  title: string
  coverFile: string
}

const upload = ref<UploadInstance>()
const addCourseRequest = reactive<AddCourseRequest>({
  title: '',
  coverFile: ''
})

const handleBeforeCoverUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const acceptType = ['image/avif', 'image/png', 'image/webp', 'image/jpeg']
  if (!acceptType.includes(rawFile.type)) {
    showErrorMessge('只能上传图片类型')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    showErrorMessge('封面大小不能超过5MB!')
    return false
  }
  return true
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  upload.value!.handleStart(file)
  upload.value?.submit()
}

const handleUploadSuccess = (res: { code: number; data: { savedFileName: string } }) => {
  addCourseRequest.coverFile = res.code == 200 ? res.data.savedFileName : ''
}

const handleSubmitClick = async () => {
  if (addCourseRequest.title == '' || addCourseRequest.coverFile == '') {
    showErrorMessge('请把参数填写完')
    return
  }

  const res = await axios.post(`/api/add-course`, addCourseRequest)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('添加课程失败')
  } else {
    showSuccessMessge('添加课程成功')
  }
}

const userInfoStore = useUserInfoStore()
</script>

<style scoped></style>
