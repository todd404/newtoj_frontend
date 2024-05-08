<template>
  <ElBadge :value="totalUnreadWhisper" :offset="[0, -1]">
    <ElPopover :visible="totalUnreadWhisper == 0 ? false : undefined">
      <template #reference>
        <ElButton text circle @click="$router.push('/whisper')">
          <ElIcon style="font-size: 20px">
            <Message />
          </ElIcon>
        </ElButton>
      </template>

      <UnreadWhisperList
        :unread-whisper-list="unreadWhisperList"
        v-model:other-id="otherId"
        v-model:other-nickname="otherNickname"
        @nickname-click="onNicknameClick"
      ></UnreadWhisperList>
    </ElPopover>
  </ElBadge>
  <WhisperDialog
    v-model="whisperDialogOpen"
    :other-id="otherId"
    :other-nickname="otherNickname"
  ></WhisperDialog>
</template>

<script setup lang="ts">
import { Message } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'
import { getUnreadWhisper, readAllWhisper, type UnreadWhisper } from '@/functions/WhisperFuntions'
import { ElPopover } from 'element-plus'
import UnreadWhisperList from '@/components/WhisperDialog/UnreadWhisperList.vue'
import WhisperDialog from '@/components/WhisperDialog/WhisperDialog.vue'

const unreadWhisperList = ref<UnreadWhisper[]>([])
const whisperDialogOpen = ref(false)
const otherId = ref('')
const otherNickname = ref('')

const totalUnreadWhisper = computed(() => {
  let count = 0
  for (let w of unreadWhisperList.value) {
    count += w.count
  }
  return count
})

const onNicknameClick = async () => {
  whisperDialogOpen.value = true
  await readAllWhisper(otherId.value)
  unreadWhisperList.value = await getUnreadWhisper()
}

onMounted(async () => {
  unreadWhisperList.value = await getUnreadWhisper()
})
</script>

<style scoped></style>
