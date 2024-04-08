import { useUserInfoStore } from '@/stores/userInfoStore'
import axios from 'axios'

export default RefreshToken

function RefreshToken() {
  const userInfoStore = useUserInfoStore()
  axios.defaults.headers.common['Authorization'] = `Bearer ${userInfoStore.getToken.value}`
}
