<template>
  <div
    style="
      display: flex;
      justify-content: center;
      padding: 0 10vw;
      margin-bottom: 32px;
      gap: 10px;
      align-items: center;
    "
  >
    <ElIcon style="font-size: 18px"> <Search /> </ElIcon>
    <ElInput style="width: 40rem" v-model="searchContent"></ElInput>
  </div>
  <div style="display: flex; flex-direction: column; padding: 0 10vw; gap: 10px">
    <template v-for="(job, index) of showJobList" :key="`job-${index}`">
      <ElCard body-style="display: flex; align-items: center;">
        <img width="48x" height="48px" :src="`http:///file/cover/job/${job.id}.jpg`" />
        <div style="display: flex; flex-direction: column; margin-left: 16px; flex-grow: 1">
          <ElText style="width: 100%">{{ job.title }}</ElText>
          <ElText type="info" style="width: 100%">{{ job.require }}</ElText>
        </div>
        <div style="display: flex; flex-direction: column; align-items: end">
          <ElText type="success">{{ job.salary }}</ElText>
          <ElButton
            type="primary"
            v-if="!job.isEnroll"
            style="width: 4rem"
            @click="jobEnroll(job.id)"
            >参与</ElButton
          >
          <ElButton
            type="danger"
            v-if="job.isEnroll"
            style="width: 4rem"
            @click="cancelJobEnroll(job.id)"
            >取消参与</ElButton
          >
        </div>
      </ElCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge } from '@/functions/utils'
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

interface JobListItem {
  id: number
  title: string
  require: string
  salary: string
  isEnroll: boolean
}

const jobList = ref<JobListItem[]>([])
const jobEnrollList = ref<number[]>([])
const showJobList = computed<JobListItem[]>(() => {
  if (searchContent.value == '') {
    return jobList.value.map((v) => {
      return { ...v, isEnroll: jobEnrollList.value.includes(v.id) }
    })
  }

  return jobList.value
    .filter((v) => v.title.includes(searchContent.value))
    .map((v) => {
      return { ...v, isEnroll: jobEnrollList.value.includes(v.id) }
    })
})
const searchContent = ref('')

const getStartUnexpiredJobList = async () => {
  const res = await axios.get(`/api/all-job`)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取招聘列表失败')
  } else {
    jobList.value = data.data
  }
}

const getJobEnrollList = async () => {
  const res = await axios.get(`/api/job-enroll`)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取招聘列表信息失败')
  } else {
    jobEnrollList.value = data.data
  }
}

const jobEnroll = async (jobId: number) => {
  const res = await axios.post(`/api/add-job-enroll`, { jobId })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('参与招聘失败')
  } else {
    getJobEnrollList()
  }
}

const cancelJobEnroll = async (jobId: number) => {
  const res = await axios.post(`/api/remove-job-enroll`, { jobId })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('取消参与招聘失败')
  } else {
    getJobEnrollList()
  }
}
onMounted(() => {
  getJobEnrollList()
  getStartUnexpiredJobList()
})
</script>

<style scoped>
img {
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
}
</style>
