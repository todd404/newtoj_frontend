import { useUserInfoStore } from '@/stores/userInfoStore'
import axios from 'axios'
import type { ResponseResult } from './ResponseResult'

export function refreshAxiosToken() {
  const userInfoStore = useUserInfoStore()
  axios.defaults.headers.common['Authorization'] = `Bearer ${userInfoStore.getToken.value}`
}

export async function refreshUserInfo() {
  const userInfoStore = useUserInfoStore()
  const res = await axios.get(`/api/userinfo`)
  const data: ResponseResult = res.data

  if (data.code == 200) {
    userInfoStore.setUserInfo(data.data)
  }
}
