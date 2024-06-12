<template>
  <div
    style="
      display: flex;
      width: 920px;
      height: 475px;
      padding: 0 10vw;
      position: absolute;
      left: calc(50% - 460px - 10vw);
      top: 10vh;
    "
  >
    <div class="whisper-select">
      <ElBadge :show-zero="false" :value="0" style="width: 90%; height: auto">
        <div
          class="whisper-select-item"
          :class="{ whisperSelectItemSelected: activeId == 1 }"
          @click="onWhisperSelectItemClick(1)"
        >
          <ElAvatar :src="`/file/avatar/1.png`" style="flex-shrink: 0"></ElAvatar>
          <div style="width: 52px; display: flex; flex-direction: column">
            <ElText truncated style="width: 52px">管理员</ElText>
            <ElText truncated style="width: 52px" type="info" size="small">{{
              adminLastMessage.message
            }}</ElText>
          </div>
          <ElText
            type="info"
            size="small"
            style="width: 55px; align-self: flex-start; text-align: end"
            >{{ getShowDateTimeString(adminLastMessage.date) }}</ElText
          >
        </div>
      </ElBadge>

      <template v-for="(wh, index) of whisperHistoryList" :key="`whisper-history-${index}`">
        <template v-if="wh.userId != 1">
          <ElBadge
            :show-zero="false"
            :value="wh.unreadCount"
            style="width: 90%; margin: 10px 10px; height: auto"
          >
            <div
              class="whisper-select-item"
              :class="{ whisperSelectItemSelected: activeId == wh.userId }"
              @click="onWhisperSelectItemClick(wh.userId)"
            >
              <ElAvatar :src="`/file/avatar/${wh.userId}.png`" style="flex-shrink: 0"></ElAvatar>
              <div style="width: 52px; display: flex; flex-direction: column">
                <ElText truncated style="width: 52px">{{ wh.nickname }}</ElText>
                <ElText truncated style="width: 52px" type="info" size="small">{{
                  wh.lastMessage
                }}</ElText>
              </div>
              <ElText
                type="info"
                size="small"
                style="width: 55px; align-self: flex-start; text-align: end"
                >{{ getShowDateTimeString(wh.lastMessageDate) }}</ElText
              >
            </div>
          </ElBadge>
        </template>
      </template>
    </div>
    <div>
      <ChatVieForWhisperView ref="chatViewRef" :other-id="otherId"></ChatVieForWhisperView>
      <ElDivider style="margin: 1px 0; width: 720px" />
      <ElInput
        style="width: 720px"
        ref="inputRef"
        type="textarea"
        v-model="whisperContent"
        :rows="3"
        resize="none"
      ></ElInput>
      <div style="display: grid; justify-content: end; padding-top: 7px">
        <ElButton @click="onSendButtonClick">发送</ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { sendWhisper, type Whisper } from '@/functions/WhisperFuntions'
import axios from 'axios'
import type { ResponseResult } from '@/functions/ResponseResult'
import { showErrorMessge } from '@/functions/utils'
import ChatVieForWhisperView from '@/components/whisper/ChatViewForWhisperView.vue'
import dayjs from 'dayjs'

interface WhisperHistory {
  userId: number
  nickname: string
  unreadCount: number
  lastMessageDate: string
  lastMessage: string
}

const whisperHistoryList = ref<WhisperHistory[]>([])
const whisperContent = ref('')
const inputRef = ref()
const chatViewRef = ref()
const otherId = ref('')
const activeId = ref(0)
const adminLastMessage = reactive({
  message: '',
  date: ''
})

const getWhisperHistoryList = async () => {
  const res = await axios.get(`/api/whisper-history`)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('获取私信列表失败')
  } else {
    let historyList: WhisperHistory[] = data.data
    for (var whisper of historyList) {
      if (whisper.userId == 1) {
        adminLastMessage.message = whisper.lastMessage
        adminLastMessage.date = whisper.lastMessageDate
      }
    }

    historyList = historyList.sort(
      (a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime()
    )
    whisperHistoryList.value = historyList
  }
}

const setRead = async (otherId: string) => {
  const whisper: Whisper = {
    id: 0,
    sendUserId: otherId,
    content: '',
    createAt: '',
    receiveUserId: ''
  }

  const res = await axios.post(`/api/read-all-whisper`, whisper)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('设置已读失败')
  }
}

const onWhisperSelectItemClick = (id: number) => {
  otherId.value = id.toString()
  activeId.value = id

  let unreadCount: number = 0
  for (var wh of whisperHistoryList.value) {
    if (wh.userId == id) {
      unreadCount = wh.unreadCount
    }
  }

  if (unreadCount > 0) {
    setRead(id.toString())
  }
}

const onSendButtonClick = async () => {
  if (whisperContent.value == '') {
    message.error('不能发送空白内容')

    return
  }

  const whisper: Whisper = {
    id: 0,
    sendUserId: '',
    receiveUserId: otherId.value,
    content: whisperContent.value,
    createAt: ''
  }

  await sendWhisper(whisper)
  inputRef.value.clear()
  chatViewRef.value.goBottom()
  getWhisperHistoryList()
}

const getShowDateTimeString = (date: string): string => {
  const dateTime = new Date(date)
  const now = new Date()
  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)
  if (dateTime.toDateString() == now.toDateString()) {
    return dateTime.toLocaleTimeString()
  }

  if (dateTime.toDateString() == yesterday.toDateString()) {
    return '昨天'
  }

  return dayjs(dateTime).format('YY/MM/DD')
}

onMounted(() => {
  getWhisperHistoryList()
  setInterval(() => {
    getWhisperHistoryList()
  }, 1000)
})
</script>

<style scoped>
.whisper-select {
  min-width: 200px;
  height: 100%;
  border: 1px solid var(--el-border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.whisper-select-item {
  width: 100%;
  display: flex;
  justify-content: space-around;
  cursor: pointer;
}

.whisper-select-item:hover {
  background: rgba(145, 152, 159, 0.2);
  border-radius: 4px;
  color: #808f7c;
}

.whisperSelectItemSelected {
  background: rgba(116, 121, 113, 0.2);
  border-radius: 4px;
}
</style>
