<template>
  <div style="display: flex; flex-direction: column; padding: 0 10vw; align-items: center">
    <div style="display: flex">
      <div style="display: flex; width: 30vw; align-items: center; justify-content: space-around">
        <ElText>搜索标题</ElText>
        <ElInput style="width: 20rem"></ElInput>
        <ElButton :icon="Search" circle></ElButton>
      </div>
      <ElDivider direction="vertical" style="height: 32px"></ElDivider>
      <div style="display: flex; width: 30vw; align-items: center; justify-content: space-around">
        <ElText>搜索标签</ElText>
        <ElInput style="width: 20rem"></ElInput>
        <ElButton :icon="Search" circle></ElButton>
      </div>
    </div>
    <ProblemsetTable></ProblemsetTable>
  </div>
</template>

<script setup lang="ts">
import ProblemsetTable from '@/components/problemset/ProblemsetTable.vue'
import { Search } from '@element-plus/icons-vue'
</script>

<style scoped></style>
