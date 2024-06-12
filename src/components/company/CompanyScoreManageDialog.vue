<template>
  <ElDialog v-model="dialogOpen" title="成绩管理">
    <div style="margin-bottom: 16px">
      <Button
        type="primary"
        :disabled="!hasSelected"
        :loading="state.loading"
        @click="groupWhisperDialogOpen = true"
      >
        发送私信给选中用户
      </Button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `选中 ${state.selectedRowKeys.length} 个用户` }}
        </template>
      </span>
    </div>
    <div style="display: flex; gap: 8px; align-items: center; justify-content: center">
      <span>分数大于：</span>
      <InputNumber size="small" v-model:value="filterNumber.score!" />

      <Divider type="vertical" />

      <span>时间小于：</span>
      <InputNumber size="small" v-model:value="filterNumber.time!" />
    </div>
    <Table
      :columns="cols"
      :data-source="examScoreList"
      :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'download'">
          <Button type="link" @click="handleDownloadAllDetailClick()">下载总体得分详情</Button>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'download'">
          <Button type="link" @click="handleDownloadDetailClick(record)">下载个人得分详情</Button>
        </template>
      </template>
    </Table>
  </ElDialog>
  <GroupWhisperDialog
    v-model:dialog-open="groupWhisperDialogOpen"
    :id-list="state.selectedRowKeys"
  ></GroupWhisperDialog>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge } from '@/functions/utils'
import { Table, type TableColumnsType, Button, InputNumber, Divider } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/table/interface'
import axios from 'axios'
import { computed, reactive, ref, watch } from 'vue'
import GroupWhisperDialog from '../GroupWhisperDialog/GroupWhisperDialog.vue'

interface ExamScore {
  key: Key
  userId: number
  username: string
  nickname: string
  score: number
  timeUsed: number
}

const dialogOpen = defineModel<boolean>({ required: true })
const groupWhisperDialogOpen = ref(false)
const props = defineProps<{ examId: number; examTile: string }>()
const rawExamScoreList = ref<ExamScore[]>([])
const examScoreList = ref<ExamScore[]>([])

const cols: TableColumnsType = [
  { title: '用户id', dataIndex: 'userId' },
  { title: '用户名', dataIndex: 'username' },
  { title: '用户昵称', dataIndex: 'nickname' },
  {
    title: '得分',
    dataIndex: 'score',
    sorter: (a: ExamScore, b: ExamScore) => a.score - b.score
  },
  {
    title: '所用时间',
    dataIndex: 'timeUsed',
    sorter: (a: ExamScore, b: ExamScore) => a.timeUsed - b.timeUsed
  },
  { title: '下载得分详情', key: 'download' }
]

const state = reactive<{
  selectedRowKeys: Key[]
  loading: boolean
}>({
  selectedRowKeys: [],
  loading: false
})
const hasSelected = computed(() => state.selectedRowKeys.length > 0)

const filterNumber = reactive<{
  score: number | null
  time: number | null
}>({
  score: null,
  time: null
})

const getExamScoreList = async () => {
  const res = await axios.get('/api/score-list', { params: { examId: props.examId } })
  const data: ResponseResult = res.data
  const scoreList: ExamScore[] = data.data
  if (data.code != 200) {
    showErrorMessge('获取成绩列表失败')
  } else {
    rawExamScoreList.value = scoreList.map((value) => {
      return { ...value, key: value.userId }
    })
    examScoreList.value = rawExamScoreList.value
  }
}

const handleDownloadDetailClick = (record: Record<string, any>) => {
  const a = document.createElement('a')
  a.style.display = 'none'
  a.download = `${record.username}_测验_${props.examTile}_详情.xlsm`
  a.href = `/file/exam_result/exam_${props.examId}_user_${record.userId}.xlsm`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const handleDownloadAllDetailClick = () => {
  axios
    .get(`/api/download-exam-all-answer`, {
      params: { examId: props.examId },
      responseType: 'blob'
    })
    .then(function (res) {
      let blob = new Blob([res.data])
      let url = window.URL.createObjectURL(blob) // 创建 url 并指向 blob
      let a = document.createElement('a')
      a.href = url
      a.download = `测试_${props.examId}_${props.examTile}_全体分数详情.xlsx`
      a.click()
      window.URL.revokeObjectURL(url) // 释放该 url
    })
    .catch(function (error) {
      console.log(error)
    })
}

const onSelectChange = (selectedRowKeys: Key[]) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys)
  state.selectedRowKeys = selectedRowKeys
}

watch(
  () => props.examId,
  () => {
    getExamScoreList()
  }
)

watch(filterNumber, (newFilterNumber) => {
  let { score, time } = newFilterNumber
  if (score == null) {
    score = -1
  }

  if (time == null) {
    time = Number.MAX_VALUE
  }

  examScoreList.value = rawExamScoreList.value
    .filter((v) => v.score > score!)
    .filter((v) => v.timeUsed < time!)
})
</script>

<style scoped></style>
