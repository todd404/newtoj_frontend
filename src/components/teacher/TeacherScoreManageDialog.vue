<template>
  <ElDialog v-model="dialogOpen" title="成绩管理">
    <Table :columns="cols" :data-source="examScoreList">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'download'">
          <Button type="link" @click="handleDownloadDetailClick(record)">下载</Button>
        </template>
      </template>
    </Table>
  </ElDialog>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge } from '@/functions/utils'
import { Table, type TableColumnsType, Button } from 'ant-design-vue'
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'

interface ExamScore {
  userId: number
  username: string
  nickname: string
  score: number
  timeUsed: number
}

const dialogOpen = defineModel<boolean>({ required: true })
const props = defineProps<{ examId: number; examTile: string }>()
const examScoreList = ref<ExamScore[]>([])

const cols: TableColumnsType = [
  { title: '用户id', dataIndex: 'userId' },
  { title: '用户名', dataIndex: 'username' },
  { title: '用户昵称', dataIndex: 'nickname' },
  { title: '得分', dataIndex: 'score' },
  { title: '所用时间', dataIndex: 'timeUsed' },
  { title: '下载得分详情', key: 'download' }
]

const getExamScoreList = async () => {
  const res = await axios.get('/api/score-list', { params: { examId: props.examId } })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取成绩列表失败')
  } else {
    examScoreList.value = data.data
  }
}

const handleDownloadDetailClick = (record: Record<string, any>) => {
  const a = document.createElement('a')
  a.style.display = 'none'
  a.download = `${record.username}_测验_${props.examTile}_成绩`
  a.href = `http://localhost/file/exam_result/exam_${props.examId}_user_${record.userId}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

watch(
  () => props.examId,
  () => {
    getExamScoreList()
  }
)
</script>

<style scoped></style>
