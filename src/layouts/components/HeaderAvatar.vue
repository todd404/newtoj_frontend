<template>
  <div>
    <ElPopover trigger="hover">
      <p>test</p>
      <template #reference>
        <ElAvatar> </ElAvatar>
      </template>
    </ElPopover>
  </div>
</template>

<script setup lang="ts">
import { ElAvatar, ElPopover } from 'element-plus'
</script>

<style scoped></style>
