<template>
  <div class="home-layout">
    <ElContainer>
      <ElHeader>
        <HomeLayoutHeader></HomeLayoutHeader>
      </ElHeader>

      <ElMain style="height: 92vh; overflow-y: auto">
        <RouterView></RouterView>
      </ElMain>
    </ElContainer>
  </div>
</template>

<script setup>
import HomeLayoutHeader from './components/TabsHeader.vue'
</script>

<style lang="scss" scoped></style>
