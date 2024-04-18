<template>
  <div class="admin-layout">
    <ElContainer>
      <ElAside>
        <h5 class="admin-menu-title">Toj Admin</h5>
        <ElMenu router :default-active="$route.path">
          <ElSubMenu index="problem" style="height: 100vh">
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
import { Memo, Plus, Edit } from '@element-plus/icons-vue'
</script>

<style scoped>
.admin-menu-title {
  font-weight: 700;
  font-size: large;
  color: #606266;
  padding-left: 1rem;
}
</style>
