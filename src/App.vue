<template>
  <Skeleton active v-if="loading" :paragraph="{ rows: 12 }"></Skeleton>
  <RouterView />
</template>

<script setup lang="ts">
import Skeleton from 'ant-design-vue/es/skeleton/Skeleton'
import { onMounted, ref } from 'vue'
import { refreshUserInfo } from './functions/UserFuntions'
import router from './router'

const loading = ref(true)

onMounted(() => {
  refreshUserInfo()
})

router.afterEach(() => {
  loading.value = false
})
</script>

<style scoped></style>
