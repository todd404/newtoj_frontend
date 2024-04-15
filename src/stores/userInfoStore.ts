import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface UserInfo {
  userId: number
  username: string
  nickname: string
  avatar: string
  ranking: number
  role: string
}

export const useUserInfoStore = defineStore(
  'userinfo',
  () => {
    const storeToken = ref('')
    const storeUserInfo = ref<UserInfo>()

    const getToken = computed(() => storeToken)
    const getUserInfo = computed(() => storeUserInfo)

    function setToken(token: string) {
      storeToken.value = token
    }

    function setUserInfo(userInfo: UserInfo) {
      storeUserInfo.value = userInfo
    }

    function deleteToken() {
      storeToken.value = ''
    }

    function deleteUserInfo() {
      storeUserInfo.value = undefined
    }

    return {
      storeToken,
      storeUserInfo,
      getToken,
      getUserInfo,
      setToken,
      setUserInfo,
      deleteToken,
      deleteUserInfo
    }
  },
  {
    persist: true
  }
)
