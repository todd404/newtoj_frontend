<template>
  <div
    ref="divRef"
    style="background-color: #eee; width: 100%; height: 400px; overflow-y: auto; overflow-x: hidden"
  >
    <ElSkeleton :loading="loading" :rows="5" animated :throttle="500"></ElSkeleton>
    <template v-for="(whisper, index) of whisperList" :key="index">
      <ChatMessage :type="whisper.sendUserId == mineId?.toString() ? 'mine' : 'other'">
        {{ whisper.content }}
      </ChatMessage>
    </template>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import ChatMessage from './ChatMessage.vue'
import { getWhisperList, type Whisper } from '@/functions/WhisperFuntions'
import { useUserInfoStore } from '@/stores/userInfoStore'

const userInfoStore = useUserInfoStore()

const whisperList = ref<Whisper[]>([])
const loading = ref(true)
const mineId = userInfoStore.getUserInfo.value?.userId //TODO: 替换为Store中的userinfo
const divRef = ref<HTMLElement | null>(null)

const props = defineProps<{
  otherId: string
  dialogOpen: boolean
}>()

function goBottom() {
  divRef.value?.scrollTo({ top: divRef.value.scrollHeight, behavior: 'smooth' })
}

watch(
  () => whisperList.value.length,
  () => {
    nextTick(() => {
      goBottom()
    })
  }
)

defineExpose({ goBottom })

const refreshWhipserList = async () => {
  whisperList.value = await getWhisperList(props.otherId)
  loading.value = false

  if (props.dialogOpen) {
    setTimeout(() => {
      refreshWhipserList()
    }, 1000)
  }
}

watch(
  () => props.dialogOpen,
  (newOpenState) => {
    if (newOpenState) {
      refreshWhipserList()
    }
  }
)

onMounted(() => {
  refreshWhipserList()
})
</script>

<style scoped></style>
