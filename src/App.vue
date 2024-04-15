<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { refreshUserInfo } from './functions/UserFuntions'

onMounted(() => {
  refreshUserInfo()
})
</script>

<style scoped></style>
