<template>
  <ElPopover :disabled="popoverDisabled" trigger="hover">
    <div style="display: flex; flex-direction: column">
      <ElButton text @click="$router.push('/profile')">个人中心</ElButton>
      <ElButton
        v-if="userInfoStore.getUserInfo.value?.role != 'user'"
        style="margin-left: 0px"
        text
        @click="$router.push(`/${userInfoStore.getUserInfo.value?.role}`)"
      >
        管理后台
      </ElButton>
      <ElLink type="primary" @click.prevent="logout"> 退出 </ElLink>
    </div>

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
import { message } from 'ant-design-vue'
defineProps({
  popoverDisabled: Boolean
})

const userInfoStore = useUserInfoStore()

const logout = async () => {
  let res = await axios.get('/api/logout')
  let body = res.data

  if (body.code == 200) {
    message.success('成功退出')

    userInfoStore.deleteToken()
    userInfoStore.deleteUserInfo()
    location.reload()
  } else {
    message.error('退出失败')
  }
}
</script>

<style scoped>
.header-avatar {
  display: flex;
  height: 40px;
}
</style>
