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
        <ElLink @click="registerDialogOpen = true"> 立即注册 </ElLink>
        <ElButton type="primary" class="submit-button" @click.prevent="submitLoginForm">
          登录
        </ElButton>
      </ElFormItem>
    </ElForm>
  </ElDialog>
  <RegisterDialog v-model="registerDialogOpen"></RegisterDialog>
</template>

<script setup lang="ts">
import { refreshAxiosToken } from '@/functions/UserFuntions'
import { useUserInfoStore } from '@/stores/userInfoStore'
import axios from 'axios'
import { type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import RegisterDialog from './RegisterDialog.vue'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'

const dialogOpen = defineModel({ type: Boolean })
const registerDialogOpen = ref<boolean>(false)

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

  if (body.code != 200) {
    showErrorMessge('登陆失败')
  } else {
    showSuccessMessge('登录成功')
    let token = body.data.token
    const userinfoStore = useUserInfoStore()
    userinfoStore.setToken(token)

    refreshAxiosToken()

    dialogOpen.value = false
    location.reload()
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
