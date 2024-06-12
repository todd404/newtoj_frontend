<template>
  <div
    style="
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
    "
  >
    <div style="width: 256px; height: 256px">
      <ElIcon v-if="matching" style="font-size: 256px" class="is-loading"><Loading /></ElIcon>
      <ElText
        v-if="matching"
        type="success"
        style="font-size: 32px; position: absolute; top: calc(50% - 38px); right: calc(50% - 48px)"
      >
        匹配中
      </ElText>

      <ElText
        v-if="!matching"
        style="
          color: #b28fce;
          font-size: 32px;
          position: absolute;
          top: calc(50% - 28px);
          right: calc(50% - 82.5px);
        "
      >
        {{ `积分：${userInfoStore.getUserInfo.value?.ranking}` }}
      </ElText>
    </div>

    <ElButton type="success" v-if="!matching" @click="matching = true"> 开始匹配 </ElButton>
    <ElButton type="danger" v-if="matching"> 停止匹配 </ElButton>
  </div>
</template>

<script setup lang="ts">
import { useUserInfoStore } from '@/stores/userInfoStore'
import { Loading } from '@element-plus/icons-vue'
import { ref } from 'vue'

const matching = ref(false)
const userInfoStore = useUserInfoStore()
</script>

<style scoped></style>
