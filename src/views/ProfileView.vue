<template>
  <div
    style="display: flex; flex-direction: column; align-items: center; padding: 0 10vw; width: 100%"
  >
    <ElDivider>头像修改</ElDivider>
    <el-upload
      class="avatar-uploader"
      action="/api/upload-avatar"
      :headers="{ Authorization: `Bearer ${userInfoStore.getToken.value}` }"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" @error="imageUrl = ``" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <ElDivider>信息修改</ElDivider>
    <ElForm
      :model="profileForm"
      :rules="profileFromRules"
      style="width: 65%; padding-top: 10px"
      status-icon
      label-width="auto"
      label-position="left"
    >
      <ElFormItem label="用户名">
        <ElInput autocomplete="off" :disabled="true" :placeholder="userInfo?.username"></ElInput>
      </ElFormItem>
      <ElFormItem label="用户昵称" prop="nickname">
        <ElInput v-model="profileForm.nickname"></ElInput>
      </ElFormItem>
      <ElFormItem style="align-content: center">
        <ElButton style="position: absolute; left: 50%; top: 5px; transform: translate(-50%, -50%)">
          提交
        </ElButton>
      </ElFormItem>
    </ElForm>

    <ElDivider>密码重置</ElDivider>
    <ElForm
      :model="changePasswordForm"
      :rules="changePasswordFormRules"
      style="width: 65%; padding-top: 10px"
      label-width="auto"
      label-position="left"
    >
      <ElFormItem label="旧密码" prop="oldPassword">
        <ElInput v-model="changePasswordForm.oldPassword"></ElInput>
      </ElFormItem>
      <ElFormItem label="新密码" prop="newPassword">
        <ElInput v-model="changePasswordForm.newPassword"></ElInput>
      </ElFormItem>
      <ElFormItem label="确认密码" prop="checkNewPassword">
        <ElInput v-model="changePasswordForm.checkNewPassword"></ElInput>
      </ElFormItem>
      <ElFormItem style="align-content: center">
        <ElButton style="position: absolute; left: 50%; top: 5px; transform: translate(-50%, -50%)">
          提交
        </ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'
import { useUserInfoStore } from '@/stores/userInfoStore'
import axios from 'axios'
import type { FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

const userInfoStore = useUserInfoStore()
const userInfo = userInfoStore.getUserInfo.value
const imageUrl = ref(`/file/avatar/${userInfo?.userId}.png`)

interface ProfileForm {
  nickname: string
}

interface ChangePasswordForm {
  oldPassword: string
  newPassword: string
  checkNewPassword: string
}

const profileForm = reactive<ProfileForm>({
  nickname: userInfo?.nickname ? userInfo.nickname : ''
})

const checkNickname = async (value: any, callback: any) => {
  if (value == userInfo?.nickname) {
    callback()
    return
  }
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

const profileFromRules = reactive<FormRules<ProfileForm>>({
  nickname: [
    { required: true, message: '昵称不能为空' },
    { min: 1, max: 10, message: '最大长度为10' },
    { pattern: /[A-Za-z0-9_\-\u4e00-\u9fa5]+/, message: '不能输入非法字符' },
    { validator: validateNickname, trigger: 'blur' }
  ]
})

const changePasswordForm = reactive<ChangePasswordForm>({
  oldPassword: '',
  newPassword: '',
  checkNewPassword: ''
})

const validatePass = (rule: any, value: any, callback: any) => {
  if (value != changePasswordForm.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const changePasswordFormRules = reactive<FormRules<ChangePasswordForm>>({
  oldPassword: [
    { required: true, message: '密码不能为空' },
    { min: 6, max: 16, message: '密码最少为六位，最多为16位' },
    { pattern: /^[A-Za-z0-9_]+$/, message: '仅能包含字母、数字、下划线' }
  ],
  newPassword: [
    { required: true, message: '密码不能为空' },
    { min: 6, max: 16, message: '密码最少为六位，最多为16位' },
    { pattern: /^[A-Za-z0-9_]+$/, message: '仅能包含字母、数字、下划线' }
  ],
  checkNewPassword: [{ required: true }, { validator: validatePass }]
})

const handleUploadSuccess = (res: { code: number; msg: string }) => {
  if (res.code != 200) {
    showErrorMessge('上传头像失败')
  } else {
    showSuccessMessge('上传头像成功')
    //使用一个时间戳作为参数，让浏览器以为不是同一张图片
    imageUrl.value = `/file/avatar/${userInfo?.userId}.png?res=${new Date().getTime()}`
  }
}
</script>

<style scoped>
img {
  width: 64px;
  height: 64px;
}
</style>

<style>
.avatar-uploader {
  display: flex;
  justify-content: center;
}
.avatar-uploader .el-upload {
  width: 64px;
  justify-content: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 50% 50% 50% 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 64px;
  height: 64px;
  text-align: center;
}
</style>
