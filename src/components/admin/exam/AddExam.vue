<template>
  <div class="add-exam-cotainer">
    <ElForm inline>
      <ElFormItem label="测验名">
        <ElInput v-model="examConfig.title"></ElInput>
      </ElFormItem>
      <ElFormItem label="起止时间">
        <ElDatePicker
          v-model="examConfig.dateRange"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY/MM/DD ddd"
          time-format="A hh:mm:ss"
        ></ElDatePicker>
      </ElFormItem>
      <ElFormItem label="测验时间(分)">
        <ElInputNumber v-model="examConfig.timeLimit"></ElInputNumber>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="handleSubmitClick">提交</ElButton>
      </ElFormItem>
    </ElForm>

    <ElTable :data="examConfig.examItemList">
      <ElTableColumn label="问题类型">
        <template #default="scope">
          <span style="color: #f9bf45" v-if="scope.row.type == 'program'">编程题</span>
          <span style="color: #986db2" v-if="scope.row.type == 'choice'">单选题</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="问题标题" prop="title"></ElTableColumn>
      <ElTableColumn label="分数占比(%)">
        <template #default="scope">
          <ElInputNumber v-model="examConfig.examItemList[scope.$index].score" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="删除">
        <template #default="scope">
          <ElButton circle :icon="Delete" @click="hanleExamItemDeleteClick(scope.$index)" />
        </template>
      </ElTableColumn>
    </ElTable>

    <ElDivider>添加问题</ElDivider>

    <ElCollapse accordion>
      <ElCollapseItem title="编程问题">
        <div style="display: flex; justify-content: center; gap: 10px">
          <ElInput style="width: 32rem" v-model="programProblemSearchContent"></ElInput>
          <ElButton :icon="Search" @click="handleProgramProblemSearch"></ElButton>
        </div>

        <ElTable :data="showProgramProblemList">
          <ElTableColumn label="问题标题">
            <template #default="scope">
              <ElLink :href="`/problem/${scope.row.id}`" target="_blank">
                {{ scope.row.title }}
              </ElLink>
            </template>
          </ElTableColumn>
          <ElTableColumn label="添加">
            <template #default="scope">
              <ElButton circle :icon="Plus" @click="handleProgramProblemPlusClick(scope.row.id)" />
            </template>
          </ElTableColumn>
        </ElTable>
        <ElPagination
          style="justify-content: center"
          layout="prev, pager, next"
          :total="programProblemList.length"
          v-model:current-page="programProblemCurrentPage"
        />
      </ElCollapseItem>

      <ElCollapseItem title="单选问题">
        <div style="display: flex; justify-content: center; gap: 10px">
          <ElInput style="width: 32rem" v-model="choiceProblemSearchContent"></ElInput>
          <ElButton :icon="Search" @click="handleChoiceProblemSearch"></ElButton>
        </div>

        <ElTable :data="showChoiceProblemList">
          <ElTableColumn label="问题标题" prop="title"></ElTableColumn>
          <ElTableColumn label="添加">
            <template #default="scope">
              <ElButton circle :icon="Plus" @click="handleChoiceProblemPlusClick(scope.row.id)" />
            </template>
          </ElTableColumn>
        </ElTable>
        <ElPagination
          style="justify-content: center"
          layout="prev, pager, next"
          :total="choiceProblemList.length"
          v-model:current-page="choiceProblemCurrentPage"
        />
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge } from '@/functions/utils'
import { Search, Plus, Delete } from '@element-plus/icons-vue'
import axios from 'axios'
import { computed, onMounted, reactive, ref } from 'vue'

interface ExamItem {
  problemId: number
  type: string
  title: string
  score: number
  ownerId?: string
}

interface ProgramProblemItem {
  id: number
  title: string
  ownerId: string
}

interface ChoiceProblemItem {
  id: number
  title: string
}

interface ExamConfig {
  title: string
  dateRange: [Date, Date]
  timeLimit: number
  examItemList: ExamItem[]
}

interface AddExamRequest {
  title: string
  startTime: Date
  endTime: Date
  timeLimit: number
  examItemList: ExamItem[]
}

const examConfig = reactive<ExamConfig>({
  title: '',
  dateRange: [new Date(), new Date()],
  timeLimit: 60,
  examItemList: []
})

let rawProgramProblemList: ProgramProblemItem[]
const programProblemList = ref<ProgramProblemItem[]>([])
const programProblemCurrentPage = ref(1)
const showProgramProblemList = computed(() => {
  const sliceStart = 10 * (programProblemCurrentPage.value - 1)
  const sliceEnd = 9 + 10 * (programProblemCurrentPage.value - 1)
  return programProblemList.value.slice(sliceStart, sliceEnd)
})
const programProblemSearchContent = ref('')

let rawChoiceProblemList: ChoiceProblemItem[]
const choiceProblemList = ref<ChoiceProblemItem[]>([])
const choiceProblemCurrentPage = ref(1)
const showChoiceProblemList = computed(() => {
  const sliceStart = 10 * (choiceProblemCurrentPage.value - 1)
  const sliceEnd = 9 + 10 * (choiceProblemCurrentPage.value - 1)
  return choiceProblemList.value.slice(sliceStart, sliceEnd)
})
const choiceProblemSearchContent = ref('')

const getAllProblemList = async () => {
  const res1 = await axios.get(`/api/program-problem-list`)
  const res2 = await axios.get(`/api/own-choice-problem-list`)

  const data1: ResponseResult = res1.data
  const data2: ResponseResult = res2.data

  if (data1.code != 200 || data2.code != 200) {
    showErrorMessge('获取问题列表失败')
    return
  }

  rawProgramProblemList = data1.data
  rawChoiceProblemList = data2.data

  programProblemList.value = rawProgramProblemList
  choiceProblemList.value = rawChoiceProblemList
}

const handleProgramProblemSearch = () => {
  if (programProblemSearchContent.value == '') {
    programProblemList.value = rawProgramProblemList
    return
  }

  const searchContent = programProblemSearchContent.value
  programProblemList.value = rawProgramProblemList.filter(
    (v) => v.title.indexOf(searchContent) != -1
  )
}

const handleChoiceProblemSearch = () => {
  if (choiceProblemSearchContent.value == '') {
    choiceProblemList.value = rawChoiceProblemList
    return
  }

  const searchContent = choiceProblemSearchContent.value
  choiceProblemList.value = rawChoiceProblemList.filter((v) => v.title.indexOf(searchContent) != -1)
}

const handleProgramProblemPlusClick = (id: number) => {
  let title: string = '',
    ownerId = ''
  rawProgramProblemList = rawProgramProblemList.filter((v) => {
    if (v.id == id) {
      title = v.title
      ownerId = v.ownerId
    }
    return v.id != id
  })
  programProblemList.value = programProblemList.value.filter((v) => v.id != id)

  examConfig.examItemList.push({
    problemId: id,
    type: 'program',
    title,
    score: 0,
    ownerId
  })
}

const handleChoiceProblemPlusClick = (id: number) => {
  let title: string = ''
  rawChoiceProblemList = rawChoiceProblemList.filter((v) => {
    if (v.id == id) {
      title = v.title
    }
    return v.id != id
  })
  choiceProblemList.value = choiceProblemList.value.filter((v) => v.id != id)

  examConfig.examItemList.push({
    problemId: id,
    type: 'choice',
    title,
    score: 0
  })
}

const hanleExamItemDeleteClick = (index: number) => {
  examConfig.examItemList = examConfig.examItemList.filter((v, idx) => {
    if (index == idx) {
      if (v.type == 'program') {
        if (v.ownerId == undefined) {
          v.ownerId = ''
        }
        const pushItem = {
          id: v.problemId,
          title: v.title,
          ownerId: v.ownerId
        }
        rawProgramProblemList.push(pushItem)
        rawProgramProblemList = rawProgramProblemList.sort((a, b) => a.id - b.id)
        programProblemList.value.push(pushItem)
        programProblemList.value = programProblemList.value.sort((a, b) => a.id - b.id)
      } else if (v.type == 'choice') {
        const pushItem = {
          id: v.problemId,
          title: v.title
        }
        rawChoiceProblemList.push(pushItem)
        rawChoiceProblemList = rawChoiceProblemList.sort((a, b) => a.id - b.id)
        choiceProblemList.value.push(pushItem)
        choiceProblemList.value = choiceProblemList.value.sort((a, b) => a.id - b.id)
      }
    }

    return idx != index
  })
}

const handleSubmitClick = async () => {
  if (examConfig.title == '') {
    showErrorMessge('请填入测验名')
    return
  }

  if (examConfig.dateRange[0].getTime() < new Date().getTime()) {
    showErrorMessge('开始时间不得小于现在时间')
    return
  }

  if (examConfig.timeLimit <= 0) {
    showErrorMessge('时间限制不得小于等于零')
    return
  }

  if (examConfig.examItemList.length == 0) {
    showErrorMessge('问题列表为空')
    return
  }

  let totalScore = 0
  for (let exam of examConfig.examItemList) {
    totalScore += exam.score
  }

  if (totalScore != 100) {
    showErrorMessge('所有问题分数占比总和必须为100 (%)')
    return
  }

  const addExamRequest: AddExamRequest = {
    ...examConfig,
    startTime: examConfig.dateRange[0],
    endTime: examConfig.dateRange[1]
  }
  await axios.post(`/api/add-exam`, addExamRequest)
}

onMounted(() => {
  getAllProblemList()
})
</script>

<style scoped>
.add-exam-cotainer {
  display: felx;
  flex-direction: column;
  width: 100%;
  gap: 10px;
}
</style>
