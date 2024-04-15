<template>
  <div>
    <template v-for="whisper of unreadWhisperList" :key="whisper.sendUserId">
      <ElDivider style="margin: 3px 0"></ElDivider>
      <ElSpace>
        <ElAvatar :src="`/file/avatar/${whisper.sendUserId}.png`"></ElAvatar>
        <ElLink
          type="primary"
          @click="
            () => {
              $emit('update:otherId', whisper.sendUserId)
              $emit('update:otherNickname', whisper.sendUserNickname)
              $emit('nicknameClick')
            }
          "
        >
          {{ whisper.sendUserNickname }}
        </ElLink>
      </ElSpace>
      <ElDivider style="margin: 3px 0"></ElDivider>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { UnreadWhisper } from '@/functions/WhisperFuntions'
import WhisperDialog from './WhisperDialog.vue'
import { ref } from 'vue'

defineModel<string>('otherId')
defineModel<string>('otherNickname')

const emit = defineEmits<{
  (e: 'nicknameClick'): void
}>()

const props = defineProps<{
  unreadWhisperList: UnreadWhisper[]
}>()
</script>

<style scoped></style>
