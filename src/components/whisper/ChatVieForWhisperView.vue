<template>
  <div
    ref="divRef"
    style="
      background-color: #eee;
      width: 720px;
      height: 400px;
      overflow-y: auto;
      overflow-x: hidden;
    "
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
import { nextTick, ref, watch } from 'vue'
import { getWhisperList, type Whisper } from '@/functions/WhisperFuntions'
import { useUserInfoStore } from '@/stores/userInfoStore'
import ChatMessage from '../WhisperDialog/ChatMessage.vue'

const userInfoStore = useUserInfoStore()

const whisperList = ref<Whisper[]>([])
const loading = ref(false)
const mineId = userInfoStore.getUserInfo.value?.userId
const divRef = ref<HTMLElement | null>(null)
let timerId: number | undefined

const props = defineProps<{
  otherId: string
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

  timerId = setTimeout(() => {
    refreshWhipserList()
  }, 1000)
}

watch(
  () => props.otherId,
  () => {
    if (timerId != undefined) {
      clearTimeout(timerId)
    }
    loading.value = true
    refreshWhipserList()
  }
)
</script>

<style scoped></style>
