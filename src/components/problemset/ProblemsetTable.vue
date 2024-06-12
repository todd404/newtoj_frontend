<template>
  <ElSpace fill direction="vertical" :fill-ratio="70" class="problemset-table-container">
    <div style="display: flex">
      <div style="display: flex; width: 30vw; align-items: center; justify-content: space-around">
        <ElText>搜索标题</ElText>
        <ElInput style="width: 20rem" v-model="searchTitleContent"></ElInput>
        <ElButton :icon="Search" circle @click="handleTilteSearchClick()"></ElButton>
      </div>
      <ElDivider direction="vertical" style="height: 32px"></ElDivider>
      <div style="display: flex; width: 30vw; align-items: center; justify-content: space-around">
        <ElText>搜索标签</ElText>
        <ElInput style="width: 20rem" v-model="searchTagContent"></ElInput>
        <ElButton :icon="Search" circle @click="handleTagSearchClick()"></ElButton>
      </div>
    </div>
    <ElTable v-loading="loading" :data="showTableData" size="large" style="width: 80%">
      <ElTableColumn label="状态" width="80">
        <template #default="scope">
          <ElIcon color="green" v-if="scope.row.passed">
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
          <ElText :type="getAcceptanceRateColor(scope.row.passingRate)">
            {{ `${scope.row.passingRate}%` }}</ElText
          >
        </template>
      </ElTableColumn>

      <ElTableColumn label="标签">
        <template #default="scope">
          <ElSpace warp>
            <template v-for="(tag, index) of scope.row.tags" :key="index">
              <ElButton :color="getTagColor(tag)" @click="handleTagClick(tag)">
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
import { computed, onMounted, ref, watch } from 'vue'
import { Search, Check } from '@element-plus/icons-vue'

interface tableItem {
  id: number
  passed: boolean
  title: string
  passingRate: string
  difficulty: number
  tags: string[]
}

const maxRow = 10

const loading = ref(true)
const problemsetData = ref<tableItem[]>([])
const dataCount = computed<number>(() => tableData.value.length)
const currentPage = ref(0)
const tableData = ref<tableItem[]>([])
const showTableData = ref<tableItem[]>([])

const searchTitleContent = ref('')
const searchTagContent = ref('')
const lastSearchTag = ref('')

const getProblemSet = async () => {
  let res = await axios.get('/api/problemset')
  problemsetData.value = res.data.data
  loading.value = false
}

watch(problemsetData, (newData) => {
  tableData.value = newData
  currentPage.value = 1
})

const goToPage = (page: number) => {
  let start = (page - 1) * 10
  let end = start + maxRow - 1

  showTableData.value = tableData.value.slice(start, end)
}

watch(currentPage, (newPage) => {
  goToPage(newPage)
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
  let hexColor = '#' + '00000'.substring(0, 6 - color.length) + color // 补全为六位十六进制颜色代码

  if (input == '简单问题') {
    hexColor = '#86C166'
  } else if (input == '中等问题') {
    hexColor = '#FFB11B'
  } else if (input == '困难问题') {
    hexColor == '#CB4042'
  }
  // 如果 input 等于 lastSearchTag.value，返回反色
  if (input === lastSearchTag.value) {
    // 计算加深的颜色
    let r = parseInt(hexColor.substring(1, 3), 16)
    let g = parseInt(hexColor.substring(3, 5), 16)
    let b = parseInt(hexColor.substring(5, 7), 16)

    // 加深颜色
    r = Math.max(0, r - 50)
    g = Math.max(0, g - 50)
    b = Math.max(0, b - 50)

    hexColor =
      '#' +
      ('0' + r.toString(16)).slice(-2).toUpperCase() +
      ('0' + g.toString(16)).slice(-2).toUpperCase() +
      ('0' + b.toString(16)).slice(-2).toUpperCase()
  }

  return hexColor
}

const handleTilteSearchClick = () => {
  if (searchTitleContent.value == '') {
    tableData.value = problemsetData.value
    currentPage.value = 1
    goToPage(1)
    return
  }

  tableData.value = problemsetData.value.filter((v) => v.title.includes(searchTitleContent.value))
  currentPage.value = 1
  goToPage(1)
}

const handleTagSearchClick = () => {
  if (searchTagContent.value == '') {
    tableData.value = problemsetData.value
    currentPage.value = 1
    goToPage(1)
    return
  }

  tableData.value = problemsetData.value.filter((v) => v.tags.includes(searchTagContent.value))
  currentPage.value = 1
  goToPage(1)
}

const handleTagClick = (searchTagContent: string) => {
  if (lastSearchTag.value == searchTagContent) {
    lastSearchTag.value = ''
    tableData.value = problemsetData.value
    currentPage.value = 1
    goToPage(1)
    return
  }

  lastSearchTag.value = searchTagContent
  tableData.value = problemsetData.value.filter((v) => v.tags.includes(searchTagContent))
  currentPage.value = 1
  goToPage(1)
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
