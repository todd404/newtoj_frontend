<template>
  <div class="company-layout">
    <ElContainer>
      <ElAside>
        <h5 class="admin-menu-title">企业后台</h5>
        <ElMenu router :default-active="$route.path" style="height: 100vh">
          <ElSubMenu index="problem">
            <template #title>
              <ElIcon> <Memo /> </ElIcon>
              <span>问题管理</span>
            </template>

            <ElMenuItem index="/company/add-problem">
              <ElIcon> <Plus /> </ElIcon>
              <span>添加编程问题</span>
            </ElMenuItem>

            <ElMenuItem index="/company/add-choice-problem">
              <ElIcon> <Plus /> </ElIcon>
              <span>添加单选题集</span>
            </ElMenuItem>
          </ElSubMenu>

          <ElSubMenu index="exam">
            <template #title>
              <ElIcon><DocumentCopy /></ElIcon>
              <span>测验管理</span>
            </template>

            <ElMenuItem index="/company/add-exam">
              <ElIcon> <Plus /> </ElIcon>
              <span>添加测验</span>
            </ElMenuItem>

            <ElMenuItem index="/company/edit-exam">
              <ElIcon> <Edit /> </ElIcon>
              <span>测验管理</span>
            </ElMenuItem>
          </ElSubMenu>

          <ElSubMenu index="job">
            <template #title>
              <ElIcon><DataBoard /></ElIcon>
              <span>招聘管理</span>
            </template>

            <ElMenuItem index="/company/add-job">
              <ElIcon> <Plus /> </ElIcon>
              <span>添加招聘</span>
            </ElMenuItem>

            <ElMenuItem index="/company/edit-job">
              <ElIcon> <Edit /> </ElIcon>
              <span>编辑招聘</span>
            </ElMenuItem>
          </ElSubMenu>
        </ElMenu>
      </ElAside>

      <ElContainer>
        <ElHeader></ElHeader>
        <ElMain><RouterView style="overflow-y: auto; height: 100%"></RouterView></ElMain>
      </ElContainer>
    </ElContainer>
  </div>
</template>

<script setup lang="ts">
import {
  Memo,
  Plus,
  Edit,
  DataBoard,
  DocumentCopy,
  OfficeBuilding,
  User
} from '@element-plus/icons-vue'
</script>

<style scoped>
.admin-menu-title {
  font-weight: 700;
  font-size: large;
  color: #606266;
  padding-left: 1rem;
}
</style>
