<template>
  <div style="display: flex; flex-direction: column; align-items: center">
    <div style="display: flex; align-items: center; gap: 10px">
      <ElForm inline>
        <ElFormItem label="工作内容：">
          <ElInput v-model="title"></ElInput>
        </ElFormItem>

        <ElFormItem label="工作地点">
          <ElCascader :options="pcTextArr" v-model="jobLocation"></ElCascader>
        </ElFormItem>

        <ElFormItem label="经验需求">
          <ElInput v-model="exp"></ElInput>
        </ElFormItem>

        <ElFormItem label="学历需求">
          <ElInput v-model="education"></ElInput>
        </ElFormItem>

        <ElFormItem label="薪资需求">
          <ElInput v-model="salary"></ElInput>
        </ElFormItem>

        <ElFormItem label="招聘起止日">
          <ElDatePicker
            v-model="dateRange"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY/MM/DD ddd"
            time-format="A hh:mm:ss"
          ></ElDatePicker>
        </ElFormItem>

        <ElFormItem>
          <ElButton type="primary" @click="handleSubmitClick()">提交</ElButton>
        </ElFormItem>
      </ElForm>
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
        :on-success="handleUploadSuccess"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽企业logo到这 或 <em>点击上传</em></div>
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
import { computed, ref } from 'vue'
import { pcTextArr } from 'element-china-area-data'

interface AddJobRequest {
  title: string
  require: string
  salary: string
  startDate: Date
  endDate: Date
  coverFile: string
}

const upload = ref<UploadInstance>()
const title = ref('')
const jobLocation = ref([])
const exp = ref('')
const education = ref('')
const salary = ref('')
const dateRange = ref<[Date, Date]>([new Date(), new Date()])
const coverFile = ref('')
const addJobRequest = computed<AddJobRequest>(() => {
  return {
    title: title.value,
    require: `${jobLocation.value[0]},${jobLocation.value[1]}/${exp.value}/${education.value}`,
    salary: salary.value,
    startDate: dateRange.value[0],
    endDate: dateRange.value[1],
    coverFile: coverFile.value
  }
})

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  upload.value!.handleStart(file)
  upload.value?.submit()
}

const handleUploadSuccess = (res: { code: number; data: { savedFileName: string } }) => {
  coverFile.value = res.code == 200 ? res.data.savedFileName : ''
}

const handleSubmitClick = async () => {
  if (
    title.value == '' ||
    jobLocation.value.length == 0 ||
    exp.value == '' ||
    education.value == '' ||
    salary.value == '' ||
    dateRange.value[0].toISOString() == dateRange.value[1].toISOString() ||
    coverFile.value == ''
  ) {
    showErrorMessge('请完整填写参数')
    return
  }

  const res = await axios.post(`/api/add-job`, addJobRequest.value)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('添加招聘失败')
  } else {
    showSuccessMessge('添加招聘成功')
  }
}

const userInfoStore = useUserInfoStore()
</script>

<style scoped></style>
