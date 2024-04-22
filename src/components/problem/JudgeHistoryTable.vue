<template>
  <ElTable :data="judgeHistoryList">
    <ElTableColumn label="状态">
      <template #default="scope">
        <ElText type="success" v-if="scope.row.status == '通过'">{{ scope.row.status }}</ElText>
        <ElText type="danger" v-if="scope.row.status != '通过'">{{ scope.row.status }}</ElText>
      </template>
    </ElTableColumn>
    <ElTableColumn label="执行用时">
      <template #default="scope">
        <ElText type="danger" v-if="scope.row.timeUsed == 'N/A'">{{ scope.row.timeUsed }}</ElText>
        <ElText type="success" v-if="scope.row.timeUsed != 'N/A'">{{
          `${scope.row.timeUsed} ms`
        }}</ElText>
      </template>
    </ElTableColumn>
    <ElTableColumn label="消耗内存">
      <template #default="scope">
        <ElText type="danger" v-if="scope.row.memoryUsed == 'N/A'">{{
          scope.row.memoryUsed
        }}</ElText>
        <ElText type="success" v-if="scope.row.memoryUsed != 'N/A'">{{
          `${scope.row.memoryUsed} KB`
        }}</ElText>
      </template>
    </ElTableColumn>
    <ElTableColumn label="提交时间" prop="finishAt"></ElTableColumn>
  </ElTable>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge } from '@/functions/utils'
import axios from 'axios'
import { onMounted, ref } from 'vue'
const props = defineProps<{
  problemId: string
}>()

interface JudgeHistory {
  status: string
  timeUsed: string
  memoryUsed: string
  finishAt: string
}

const judgeHistoryList = ref<JudgeHistory[]>([])

const getJudgeHistoryList = async () => {
  const res = await axios.get(`/api/judge-history`, { params: { problemId: props.problemId } })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取判题历史失败')
  } else {
    judgeHistoryList.value = data.data
  }
}

onMounted(() => {
  getJudgeHistoryList()
})
</script>

<style scoped></style>
