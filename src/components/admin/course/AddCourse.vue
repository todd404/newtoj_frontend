<template>
  <div style="display: flex; flex-direction: column; align-items: center">
    <div style="display: flex; align-items: center; gap: 10px">
      <ElText>课程标题： </ElText>
      <ElInput style="width: 40rem"></ElInput>
      <ElButton type="primary">提交</ElButton>
    </div>
    <div style="display: flex; width: 100%; justify-content: center; margin-top: 20px">
      <ElUpload
        ref="upload"
        action="/api/upload"
        :limit="1"
        accept=".jpg, .jpeg, .png"
        :headers="{ Authorization: `Bearer ${userInfoStore.getToken.value}` }"
        drag
        list-type="picture"
        style="width: 80%"
        :on-exceed="handleExceed"
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
import { useUserInfoStore } from '@/stores/userInfoStore'
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { ref } from 'vue'
const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  upload.value!.handleStart(file)
  upload.value?.submit()
}

const userInfoStore = useUserInfoStore()
</script>

<style scoped></style>
