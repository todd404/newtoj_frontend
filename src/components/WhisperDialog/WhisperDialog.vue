<template>
  <ElDialog v-model="open" width="800" center>
    <template #header="{ titleId, titleClass }">
      <div style="display: flex; justify-content: center">
        <ElSpace>
          <ElAvatar :src="`/file/avatar/${otherId}.png`"></ElAvatar>
          <h4 :id="titleId" :class="titleClass">{{ otherNickname }}</h4>
        </ElSpace>
      </div>
    </template>

    <ChatView ref="chatViewRef" :other-id="otherId" :dialog-open="open"></ChatView>
    <ElDivider style="margin: 1px 0" />
    <ElInput ref="inputRef" type="textarea" v-model="whisperContent"></ElInput>
    <div style="display: grid; justify-content: end; padding-top: 7px">
      <ElButton @click="onSendButtonClick">发送</ElButton>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatView from './ChatView.vue'
import { message } from 'ant-design-vue'
import { sendWhisper, type Whisper } from '@/functions/WhisperFuntions'
const open = defineModel<boolean>({ required: true })
const whisperContent = ref('')
const inputRef = ref()
const chatViewRef = ref()

const props = defineProps<{
  otherId: string
  otherNickname: string
}>()

const onSendButtonClick = async () => {
  if (whisperContent.value == '') {
    message.error('不能发送空白内容')

    return
  }

  const whisper: Whisper = {
    id: 0,
    sendUserId: '',
    receiveUserId: props.otherId,
    content: whisperContent.value,
    createAt: ''
  }

  sendWhisper(whisper)
  inputRef.value.clear()
  chatViewRef.value.goBottom()
}
</script>

<style scoped></style>
