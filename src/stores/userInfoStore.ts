import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore(
  'userinfo',
  () => {
    const storeToken = ref('')
    const getToken = computed(() => storeToken)

    function setToken(token: string) {
      storeToken.value = token
    }

    function deleteToken() {
      storeToken.value = ''
    }

    return { storeToken, getToken, setToken, deleteToken }
  },
  {
    persist: true
  }
)
