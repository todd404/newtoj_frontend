<template>
  <ElDialog v-model="dialogOpen" center width="500px">
    <ElForm ref="loginFormRef" :model="loginForm" :rules="rules" label-width="auto">
      <ElFormItem label="用户名" prop="username">
        <ElInput v-model="loginForm.username"></ElInput>
      </ElFormItem>

      <ElFormItem label="密码" prop="password">
        <ElInput v-model="loginForm.password" type="password"></ElInput>
      </ElFormItem>

      <ElFormItem>
        <ElLink> 立即注册 </ElLink>
        <ElButton type="primary" class="submit-button" @click.prevent="submitLoginForm">
          登录
        </ElButton>
      </ElFormItem>
    </ElForm>
  </ElDialog>
</template>

<script setup lang="ts">
import { refreshAxiosToken } from '@/functions/UserFuntions'
import { useUserInfoStore } from '@/stores/userInfoStore'
import axios from 'axios'
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  type FormInstance,
  type FormRules
} from 'element-plus'
import { reactive, ref } from 'vue'

const dialogOpen = defineModel({ type: Boolean })

const loginFormRef = ref<FormInstance>()

interface LoginForm {
  username: string
  password: string
}

const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})

const rules = reactive<FormRules<LoginForm>>({
  username: [{ required: true, pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: '请输入正确的用户名' }],
  password: [{ required: true, pattern: /^[A-Za-z\d@$!%*?&]{5,}$/, message: '请输入正确的密码' }]
})

const submitLoginForm = async () => {
  let res = await axios.post('/api/login', loginForm)
  let body = res.data

  if (body.code == 200) {
    ElMessage({
      message: '登录成功',
      type: 'success'
    })

    let token = body.data.token
    const userinfoStore = useUserInfoStore()
    userinfoStore.setToken(token)

    refreshAxiosToken()

    dialogOpen.value = false
  } else {
    ElMessage({
      message: '登录失败',
      type: 'error'
    })
  }
}
</script>

<style scoped>
.submit-button {
  position: absolute;
  top: 3%;
  right: 0%;
}
</style>
@/stores/userInfoStore
