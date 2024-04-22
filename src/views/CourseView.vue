<template>
  <div class="course-view">
    <ElSkeleton :loading="listLoading" animated :rows="8"></ElSkeleton>
    <tamplate v-for="(c, index) of courseList" :key="`course-${index}`">
      <ElCard class="course-card" @click="$router.push(`/learn/${c.id}`)">
        <div style="display: flex; flex-direction: column; justify-items: center">
          <img height="152px" :src="`http://localhost/file/cover/course/${c.id}.jpg`" />
          <ElText>算法训练营</ElText>
        </div>
      </ElCard>
    </tamplate>
  </div>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge } from '@/functions/utils'
import axios from 'axios'
import { onMounted, ref } from 'vue'

export interface Course {
  id: number
  userId: string
  nickname: string
  title: string
}

const courseList = ref<Course[]>([])
const listLoading = ref(true)

const getCourseList = async () => {
  const res = await axios.get('/api/all-course')
  const data: ResponseResult = res.data

  if (data.code != 200) {
    showErrorMessge('获取课程列表失败')
  } else {
    courseList.value = data.data
    listLoading.value = false
  }
}

onMounted(() => {
  getCourseList()
})
</script>

<style scoped>
.course-view {
  display: flex;
  gap: 50px;
  width: 100%;
  height: 80vh;
  padding: 0 10vw;
  flex-wrap: wrap;
  align-items: start;
  align-content: start;
}

.course-card {
  width: 300px;
  height: 210px;
  align-items: center;
  cursor: pointer;
  transition: all 250ms cubic-bezier(0.02, 0.01, 0.47, 1);
}

.course-card:hover {
  transform: translate(0, -3px);
  transition-delay: 0s !important;
}
</style>
