<template>
  <div>
    <Table :columns="cols" :dataSource="examList" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'score_manage'">
          <Button type="link" @click="handleScoreManageClick(record.id, record.title)"
            >管理成绩</Button
          >
        </template>
        <template v-else-if="column.key === 'delete'">
          <Button :icon="h(DeleteOutlined)" shape="circle" danger type="link"></Button>
        </template>
      </template>
    </Table>
  </div>
  <TeacherScoreManageDialog
    v-model="scoreDialogOpen"
    :examId="scoreDialogExam.id"
    :examTile="scoreDialogExam.title"
  ></TeacherScoreManageDialog>
</template>

<script setup lang="ts">
import { Table, Button, type TableColumnsType } from 'ant-design-vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { ref, h, onMounted, reactive } from 'vue'
import axios from 'axios'
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge } from '@/functions/utils'
import TeacherScoreManageDialog from '@/components/teacher/TeacherScoreManageDialog.vue'

const cols: TableColumnsType = [
  { title: '测验名', key: 'name', dataIndex: 'title' },
  { title: '成绩管理', key: 'score_manage', width: 150 },
  { title: '删除', key: 'delete', width: 150 }
]

interface Exam {
  id: number
  title: string
}

const examList = ref<Exam[]>()
const loading = ref(true)
const scoreDialogOpen = ref(false)
const scoreDialogExam = reactive<Exam>({ id: 0, title: '' })

const getExamList = async () => {
  const res = await axios.get('/api/my-exam-list')
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取测验列表失败')
  } else {
    examList.value = data.data
    loading.value = false
  }
}

const handleScoreManageClick = (examId: number, title: string) => {
  scoreDialogExam.id = examId
  scoreDialogExam.title = title
  scoreDialogOpen.value = true
}

onMounted(() => {
  getExamList()
})
</script>

<style scoped></style>
