<template>
  <ElSpace fill direction="vertical" :fill-ratio="70" class="problemset-table-container">
    <ElTable v-loading="loading" :data="tableData" size="large" style="width: 80%">
      <ElTableColumn label="状态" width="80">
        <template #default="scope">
          <ElIcon color="green" v-if="scope.row.state">
            <Check />
          </ElIcon>
        </template>
      </ElTableColumn>

      <ElTableColumn label="标题" width="320">
        <template #default="scope">
          <ElLink :href="`/problem/${scope.row.id}`" type="primary">{{ scope.row.title }}</ElLink>
        </template>
      </ElTableColumn>

      <ElTableColumn label="通过率" width="160">
        <template #default="scope">
          <ElText :type="getAcceptanceRateColor(scope.row.acceptance_rate)">
            {{ `${scope.row.acceptance_rate}%` }}</ElText
          >
        </template>
      </ElTableColumn>

      <ElTableColumn label="标签">
        <template #default="scope">
          <ElSpace warp>
            <template v-for="(tag, index) of scope.row.tags" :key="index">
              <ElButton :color="getTagColor(tag)">
                {{ tag }}
              </ElButton>
            </template>
          </ElSpace>
        </template>
      </ElTableColumn>
    </ElTable>

    <ElPagination
      :size="maxRow"
      :total="dataCount"
      v-model:current-page="currentPage"
    ></ElPagination>
  </ElSpace>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'

interface tableItem {
  id: number
  state: boolean
  title: string
  acceptance_rate: number
  difficulty: number
  tags: string[]
}

const maxRow = 10

const loading = ref(true)
const problemsetData = ref<tableItem[]>([])
const dataCount = ref(0)
const currentPage = ref(0)
const tableData = ref<tableItem[]>([])

const getProblemSet = async () => {
  let res = await axios.get(
    'http://192.168.31.14:10393/mock/9e9ed3f6-20a8-4c4f-8fa7-6181902f7308/api/problemset'
  )
  problemsetData.value = res.data.problemset
  loading.value = false
}

watch(problemsetData, (newData) => {
  dataCount.value = newData.length
  currentPage.value = 1
})

watch(currentPage, (newPage) => {
  let start = (newPage - 1) * 10
  let end = start + maxRow - 1

  tableData.value = problemsetData.value.slice(start, end)
})

const getAcceptanceRateColor = (acceptanceRate: number) =>
  acceptanceRate < 30 ? 'danger' : acceptanceRate < 50 ? 'warning' : 'success'

const getTagColor = (input: string): string => {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i)
    hash = (hash << 5) - hash + charCode
    hash |= 0 // 保证是 32 位有符号整数
  }

  // 将哈希值转换为十六进制颜色代码
  const color = (hash & 0x00ffffff).toString(16).toUpperCase() // 使用与操作确保结果是 24 位的无符号整数，并转换为十六进制字符串
  return '#' + '00000'.substring(0, 6 - color.length) + color // 补全为六位十六进制颜色代码
}

onMounted(() => {
  getProblemSet()
})
</script>

<style scoped>
.problemset-table-container {
  width: 100%;
}
</style>
