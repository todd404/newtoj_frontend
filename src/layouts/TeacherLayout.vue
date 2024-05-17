<template>
  <div class="teacher-layout">
    <ElContainer>
      <ElAside>
        <h5 class="admin-menu-title">导师后台</h5>
        <ElMenu router :default-active="$route.path" style="height: 100vh">
          <ElSubMenu index="problem">
            <template #title>
              <ElIcon> <Memo /> </ElIcon>
              <span>问题管理</span>
            </template>

            <ElMenuItem index="/teacher/add-choice-problem">
              <ElIcon> <Plus /> </ElIcon>
              <span>添加单选题集</span>
            </ElMenuItem>
          </ElSubMenu>

          <ElSubMenu index="exam">
            <template #title>
              <ElIcon><DocumentCopy /></ElIcon>
              <span>测验管理</span>
            </template>

            <ElMenuItem index="/teacher/add-exam">
              <ElIcon> <Plus /> </ElIcon>
              <span>添加测验</span>
            </ElMenuItem>

            <ElMenuItem index="/teacher/edit-exam">
              <ElIcon> <Edit /> </ElIcon>
              <span>测验管理</span>
            </ElMenuItem>
          </ElSubMenu>

          <ElSubMenu index="course">
            <template #title>
              <ElIcon><DataBoard /></ElIcon>
              <span>课程管理</span>
            </template>

            <ElMenuItem index="/teacher/add-course">
              <ElIcon> <Plus /> </ElIcon>
              <span>添加课程</span>
            </ElMenuItem>

            <ElMenuItem index="/teacher/edit-course">
              <ElIcon> <Edit /> </ElIcon>
              <span>编辑课程</span>
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
