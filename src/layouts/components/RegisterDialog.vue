<template>
  <ElDialog v-model="dialogOpenModel" title="注册" :model="registerForm">
    <ElForm
      ref="registerFormRef"
      status-icon
      :model="registerForm"
      :rules="rules"
      label-width="auto"
      label-position="left"
    >
      <ElFormItem label="用户名" prop="username">
        <ElInput autocomplete="off" v-model="registerForm.username"></ElInput>
      </ElFormItem>
      <ElFormItem label="用户昵称" prop="nickname">
        <ElInput v-model="registerForm.nickname"></ElInput>
      </ElFormItem>
      <ElFormItem label="密码" prop="password">
        <ElInput type="password" autocomplete="off" v-model="registerForm.password"></ElInput>
      </ElFormItem>
      <ElFormItem label="确认密码" prop="checkPassword">
        <ElInput type="password" autocomplete="off" v-model="registerForm.checkPassword"></ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElButton
          plain
          type="primary"
          @click="submitForm"
          style="position: absolute; right: 0%; top: 5px"
          >注册</ElButton
        >
      </ElFormItem>
    </ElForm>
  </ElDialog>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'
import axios from 'axios'
import { type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

const dialogOpenModel = defineModel<boolean>({ required: true })
interface RegisterForm {
  username: string
  nickname: string
  password: string
  checkPassword: string
}

const registerForm = reactive<RegisterForm>({
  username: '',
  nickname: '',
  password: '',
  checkPassword: ''
})
const registerFormRef = ref<FormInstance>()

const checkUsername = async (value: any, callback: any) => {
  const res = await axios.get(`/api/is-username-repeat`, { params: { username: value } })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    callback(new Error('检查用户名重复错误'))
  } else {
    if (data.data == true) {
      callback(new Error('用户名已被使用'))
    } else {
      callback()
    }
  }
}

const validateUsername = (rule: any, value: any, callback: any) => {
  checkUsername(value, callback)
}

const checkNickname = async (value: any, callback: any) => {
  const res = await axios.get(`/api/is-nickname-repeat`, { params: { nickname: value } })
  const data: ResponseResult = res.data
  if (data.code != 200) {
    callback(new Error('检查昵称重复错误'))
  } else {
    if (data.data == true) {
      callback(new Error('昵称已被使用'))
    } else {
      callback()
    }
  }
}

const validateNickname = (rule: any, value: any, callback: any) => {
  checkNickname(value, callback)
}

const validatePass = (rule: any, value: any, callback: any) => {
  if (value != registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<RegisterForm>>({
  username: [
    { required: true, message: '用户名不能未空' },
    { min: 4, max: 10, message: '最低长度为4, 最大长度为10' },
    { pattern: /^[A-Za-z0-9_]+$/, message: '仅能包含字母、数字、下划线' },
    { validator: validateUsername, trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '昵称不能为空' },
    { min: 1, max: 10, message: '最大长度为10' },
    { pattern: /[A-Za-z0-9_\-\u4e00-\u9fa5]+/, message: '不能输入非法字符' },
    { validator: validateNickname, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空' },
    { min: 6, max: 16, message: '密码最少为六位，最多为16位' },
    { pattern: /^[A-Za-z0-9_]+$/, message: '仅能包含字母、数字、下划线' }
  ],
  checkPassword: [{ required: true }, { validator: validatePass }]
})

const submitForm = async () => {
  if (registerFormRef.value == undefined) return
  await registerFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      const res = await axios.post(`/api/register`, registerForm)
      const data: ResponseResult = res.data
      if (data.code != 200) {
        showErrorMessge('注册失败')
      } else {
        showSuccessMessge('注册成功')
        dialogOpenModel.value = false
      }
    }
  })
}
</script>

<style scoped></style>
