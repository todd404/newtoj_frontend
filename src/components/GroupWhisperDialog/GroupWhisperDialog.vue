<template>
  <MovableDialog v-model:open="dialogOpen" :title="`群发给${idList.length}人`" @ok="handleOK">
    <Textarea
      v-model:value="whisperContent"
      placeholder="私信内容..."
      :auto-size="{ minRows: 2, maxRows: 5 }"
    ></Textarea>
  </MovableDialog>
</template>

<script setup lang="ts">
import { Textarea } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/table/interface'
import MovableDialog from './MovableDialog.vue'
import { ref } from 'vue'
import { showErrorMessge, showSuccessMessge } from '@/functions/utils'
import axios from 'axios'
import type { ResponseResult } from '@/functions/ResponseResult'

interface GroupWhisper {
  recieveIdList: Key[]
  whisperContent: string
}

const dialogOpen = defineModel<boolean>('dialogOpen', { required: true })
const props = defineProps<{ idList: Key[] }>()

const whisperContent = ref('')

const handleOK = async () => {
  if (whisperContent.value == '') {
    showErrorMessge('私信内容不能为空')
    return
  }

  const groupWhipser: GroupWhisper = {
    whisperContent: whisperContent.value,
    recieveIdList: props.idList
  }

  const res = await axios.post(`/api/send-group-whisper`, groupWhipser)
  const data: ResponseResult = res.data
  if (data.code != 200) {
    showErrorMessge('群发私信失败')
  } else {
    showSuccessMessge('群发私信成功')
  }
}
</script>

<style scoped></style>
