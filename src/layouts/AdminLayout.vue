<template>
  <div class="admin-layout">
    <ElContainer>
      <ElAside>
        <h5 class="admin-menu-title">Toj Admin</h5>
        <ElMenu router :default-active="$route.path" style="height: 100vh">
          <ElSubMenu index="user">
            <template #title>
              <ElIcon><User /></ElIcon>
              <span>用户管理</span>
            </template>

            <ElMenuItem index="/admin/edit-user">
              <ElIcon><Edit /></ElIcon>
              <span>编辑用户</span>
            </ElMenuItem>
          </ElSubMenu>
          <ElSubMenu index="problem">
            <template #title>
              <ElIcon> <Memo /> </ElIcon>
              <span>问题管理</span>
            </template>

            <ElMenuItem index="/admin/add-problem">
              <ElIcon> <Plus /> </ElIcon>
              <span>添加编程问题</span>
            </ElMenuItem>
            <ElMenuItem index="/admin/edit-problem">
              <ElIcon> <Edit /> </ElIcon>
              <span>编辑编程问题</span>
            </ElMenuItem>

            <ElMenuItem index="/admin/add-choice-problem">
              <ElIcon> <Plus /> </ElIcon>
              <span>添加单选题集</span>
            </ElMenuItem>
          </ElSubMenu>

          <ElSubMenu index="exam">
            <template #title>
              <ElIcon><DocumentCopy /></ElIcon>
              <span>测验管理</span>
            </template>

            <ElMenuItem index="/admin/add-exam">
              <ElIcon> <Plus /> </ElIcon>
              <span>添加测验</span>
            </ElMenuItem>
          </ElSubMenu>

          <ElSubMenu index="course">
            <template #title>
              <ElIcon><DataBoard /></ElIcon>
              <span>课程管理</span>
            </template>

            <ElMenuItem index="/admin/add-course">
              <ElIcon> <Plus /> </ElIcon>
              <span>添加课程</span>
            </ElMenuItem>

            <ElMenuItem index="/admin/edit-course">
              <ElIcon> <Edit /> </ElIcon>
              <span>编辑课程</span>
            </ElMenuItem>
          </ElSubMenu>

          <ElSubMenu index="job">
            <template #title>
              <ElIcon><OfficeBuilding /></ElIcon>
              <span>招聘管理</span>
            </template>

            <ElMenuItem index="/admin/add-job">
              <ElIcon> <Plus /> </ElIcon>
              <span>添加招聘</span>
            </ElMenuItem>

            <ElMenuItem index="/admin/edit-job">
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
