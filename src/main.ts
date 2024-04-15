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

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(UndrawUi)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

refreshAxiosToken()

app.mount('#app')
