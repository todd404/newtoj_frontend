import axios from 'axios'
import type { ResponseResult } from './ResponseResult'
import { message } from 'ant-design-vue'
import { useUserInfoStore } from '@/stores/userInfoStore'

export interface Whisper {
  id: number
  sendUserId: string
  receiveUserId: string
  content: string
  createAt: string
}

export interface UnreadWhisper {
  count: number
  sendUserId: string
  sendUserNickname: string
}

export async function getUnreadWhisper(): Promise<UnreadWhisper[]> {
  const res = await axios.get(`/api/unread-whisper`)
  const data: ResponseResult = res.data
  if (data.code == 200) {
    return data.data
  } else {
    return []
  }
}

export async function getWhisperList(otherId: string): Promise<Whisper[]> {
  const res = await axios.get(`/api/whisper-list`, { params: { other_id: otherId } })
  const data: ResponseResult = res.data
  if (data.code == 200) {
    return data.data
  } else {
    return []
  }
}

export async function sendWhisper(whisper: Whisper): Promise<boolean> {
  const res = await axios.post('/api/send-whisper', whisper)
  const data: ResponseResult = res.data
  if (data.code == 200) {
    message.success('私信发送成功')
    return true
  } else {
    message.success('私信发送失败')
    return false
  }
}

export async function readAllWhisper(otherId: string) {
  const userInfoStore = useUserInfoStore()

  const res = await axios.post('/api/read-all-whisper', {
    sendUserId: otherId,
    receiveUserId: userInfoStore.getUserInfo.value?.userId.toString()
  })
}
