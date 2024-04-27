<template>
  <div style="padding: 0 10vw; width: 100%">
    <div style="display: flex; width: 100%; justify-content: space-between">
      <img height="152px" :src="`http://localhost/file/cover/course/${courseId}.jpg`" />
      <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center">
        <ElText style="font-size: 32px">
          {{ courseInfo.title }}
        </ElText>
        <ElText>
          {{ `讲师：${courseInfo.nickname}` }}
        </ElText>
      </div>

      <div style="align-self: center">
        <ElButton type="primary" v-if="!isCourseEnroll" @click="addCourseEnroll()"
          >参与测验</ElButton
        >
        <ElButton disabled v-if="isCourseEnroll">已参与测验</ElButton>
      </div>
    </div>

    <ElDivider></ElDivider>
    <ul>
      <li
        @click="onListItemClick(f)"
        class="file-list-item"
        v-for="(f, index) of courseFileList"
        :key="`file-${index}`"
      >
        <ElIcon style="font-size: 24px">
          <VideoPlay v-if="f.fileType == 'video'" />
          <Document v-if="f.fileType != 'video'" />
        </ElIcon>

        <ElText style="margin-left: 42px">
          {{ f.file }}
        </ElText>
      </li>
    </ul>
  </div>
  <ElDialog width="1360" v-model="videoDialogOpen">
    <vue3videoPlay width="1280" height="720" :src="videoSrc"></vue3videoPlay>
  </ElDialog>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { VideoPlay, Document } from '@element-plus/icons-vue'
import vue3videoPlay from 'vue3-video-play'
import { type Course } from './CourseView.vue'
import axios from 'axios'
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'

const courseId = ref('')
const route = useRoute()
const isCourseEnroll = ref(true)
const courseInfo = ref<Course>({
  id: 0,
  userId: '',
  nickname: '',
  title: ''
})
const courseFileList = ref<CourseFile[]>()
const videoDialogOpen = ref(false)
const videoSrc = ref('')

interface CourseFile {
  file: string
  fileType: string
}

onBeforeMount(() => {
  courseId.value = typeof route.params.id == 'string' ? route.params.id : route.params.id[0]
})

onMounted(() => {
  getIsCourseEnroll()
  getCourseInfo()
  getFileList()
})

const getCourseInfo = async () => {
  const res = await axios.get(`/api/get-course`, { params: { courseId: courseId.value } })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取课程信息失败')
  } else {
    courseInfo.value = data.data
  }
}

const getFileList = async () => {
  const res = await axios.get(`/api/course-file-list`, { params: { courseId: courseId.value } })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取课程文件列表失败')
  } else {
    courseFileList.value = data.data
  }
}

const getIsCourseEnroll = async () => {
  const res = await axios.get(`/api/is-course-enroll`, { params: { courseId: courseId.value } })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取课程信息失败')
  } else {
    isCourseEnroll.value = data.data
  }
}

const addCourseEnroll = async () => {
  const res = await axios.post(`/api/add-course-enroll`, { courseId: courseId.value })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('参与课程失败')
  } else {
    showSuccessMessge('参与课程成功')
    getIsCourseEnroll()
  }
}

const onListItemClick = (file: CourseFile) => {
  if (file.fileType == 'video') {
    videoSrc.value = `http://localhost/file/course_file/${courseId.value}/${file.file}`
    videoDialogOpen.value = true
  } else {
    const link = document.createElement('a')
    link.href = `http://localhost/file/course_file/${courseId.value}/${file.file}`
    link.download = file.file
    link.click()
  }
}
</script>

<style scoped>
.file-list-item {
  padding: 0 10px;
  list-style-type: none;
  height: 48px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.file-list-item:hover {
  background: rgba(0, 137, 167, 0.2);
  border-radius: 4px;
  color: #81c7d4;
}
</style>
