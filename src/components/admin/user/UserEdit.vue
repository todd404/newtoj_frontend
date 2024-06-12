<template>
  <div>
    <ElTable :data="userList">
      <ElTableColumn label="用户id" prop="userId"></ElTableColumn>
      <ElTableColumn label="用户名" prop="username"></ElTableColumn>
      <ElTableColumn label="用户昵称" prop="nickname"></ElTableColumn>
      <ElTableColumn label="用户角色">
        <template #default="scope">
          <ElSelect
            v-model="userList[scope.$index].role"
            @change="
              () => {
                changeUserRole(scope.$index)
              }
            "
          >
            <ElOption :value="0" label="普通用户"></ElOption>
            <ElOption :value="1" label="企业用户"></ElOption>
            <ElOption :value="2" label="导师用户"></ElOption>
            <ElOption :value="3" label="管理员"></ElOption>
          </ElSelect>
        </template>
      </ElTableColumn>
      <ElTableColumn label="比赛积分">
        <template #default="scope">
          <ElInputNumber v-model="userList[scope.$index].ranking"></ElInputNumber>
        </template>
      </ElTableColumn>
      <ElTableColumn label="删除用户">
        <template #default="scope">
          <ElButton icon="Delete" circle type="danger"></ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'
import axios from 'axios'
import { onMounted, ref } from 'vue'

interface User {
  userId: number
  username: string
  nickname: string
  ranking: number
  role: number
}

const roleTable: { [key: number]: string } = {
  0: '普通用户',
  1: '导师用户',
  2: '企业用户',
  3: '管理员用户'
}

const userList = ref<User[]>([])

const getAllUserList = async () => {
  const res = await axios.get('/api/all-user')
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取用户列表失败')
  } else {
    userList.value = data.data
  }
}

const changeUserRole = async (index: number) => {
  const user: User = userList.value[index]
  const res = await axios.post(`/api/change-user-role`, user)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('改变用户角色失败')
  } else {
    showSuccessMessge('改变用户角色成功')
  }
}

onMounted(() => {
  getAllUserList()
})
</script>

<style scoped></style>
