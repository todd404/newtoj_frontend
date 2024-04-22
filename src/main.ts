import '../src/assets/main.css'
import '@/assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import UndrawUi from 'undraw-ui'
import 'undraw-ui/dist/style.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { refreshAxiosToken } from './functions/UserFuntions'
import vue3videoPlay from 'vue3-video-play' // 引入组件
import 'vue3-video-play/dist/style.css' // 引入css

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(UndrawUi)
app.use(vue3videoPlay)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

refreshAxiosToken()

app.mount('#app')
