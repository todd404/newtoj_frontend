<template>
  <ElPopover :disabled="popoverDisabled" trigger="hover">
    <ElLink type="primary" @click.prevent="logout"> 退出 </ElLink>
    <template #reference>
      <ElAvatar
        @click.prevent="$emit('avatarClick')"
        class="header-avatar"
        :src="userInfoStore.getUserInfo.value?.avatar"
      >
      </ElAvatar>
    </template>
  </ElPopover>
</template>

<script setup lang="ts">
import { useUserInfoStore } from '@/stores/userInfoStore'
import axios from 'axios'
import { ElAvatar, ElMessage, ElPopover } from 'element-plus'
defineProps({
  popoverDisabled: Boolean
})

const userInfoStore = useUserInfoStore()

const logout = async () => {
  let res = await axios.get('/api/logout')
  let body = res.data

  if (body.code == 200) {
    ElMessage({
      message: '成功退出',
      type: 'success'
    })

    userInfoStore.deleteToken()
    userInfoStore.deleteUserInfo()
  } else {
    ElMessage({
      message: '退出失败',
      type: 'error'
    })
  }
}
</script>

<style scoped>
.header-avatar {
  display: flex;
  height: 40px;
}
</style>
