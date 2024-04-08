<template>
  <div style="display: flex; align-items: center; justify-content: center">
    <ElRow class="bar" justify="center" align="middle">
      <ElCol :span="1">logo</ElCol>
      <ElCol style="flex-grow: 1" :span="22">
        <ElTabs v-model="activeName" class="nav-tabs" @tab-change="onTabChange">
          <ElTabPane name="problemset">
            <template #label>
              <span style="font-size: medium"> 题库 </span>
            </template>
          </ElTabPane>

          <ElTabPane name="test" class="my-tab">
            <template #label>
              <span style="font-size: medium"> 测试 </span>
            </template>
          </ElTabPane>
        </ElTabs>
      </ElCol>
      <ElCol :span="1">
        <HeaderAvatar :popover-disabled="!isLogin" @avatar-click="onAvatarClick"></HeaderAvatar>
      </ElCol>
    </ElRow>
  </div>
  <LoginDialog v-model="loginDialogOpen"></LoginDialog>
</template>

<script setup lang="ts">
import { ElMessage, type TabPaneName } from 'element-plus'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import HeaderAvatar from './HeaderAvatar.vue'
import LoginDialog from './LoginDialog.vue'
import { useUserInfoStore } from '@/stores/userInfoStore'

const activeName = ref('')
const loginDialogOpen = ref(false)
const isLogin = ref(false)
let route = useRouter()

onMounted(() => {
  const userInfoStore = useUserInfoStore()
  if (userInfoStore.getToken.value) {
    //已登录
    isLogin.value = true
  } else {
    isLogin.value = false
  }
})

watch(
  () => route.currentRoute.value,
  (newValue) => {
    let path = newValue.path
    path = path.slice(1)
    activeName.value = path
  }
)

const onTabChange = (name: TabPaneName) => {
  route.push(`/${name.toString()}`)
}

const onAvatarClick = () => {
  if (isLogin.value) {
    //已登录
    ElMessage('已登录')
  } else {
    loginDialogOpen.value = true
  }
}
</script>

<style lang="scss" scoped>
.bar::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: var(--el-border-color-light);
  z-index: var(--el-index-normal);
}

.nav-tabs {
  ::after {
    position: static !important;
  }
}

.bar {
  width: 80%;
}

.avatar {
  cursor: pointer;
}
</style>
