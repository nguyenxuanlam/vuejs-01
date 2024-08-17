import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { i18n } from '@/plugins/i18n'

import App from './App.vue'
import router from './router'

// Đảm bảo import tailwind.css trong main.ts để ngăn vite yêu cầu tệp css tổng thể của assets/styles/index.scss mỗi khi hmr dẫn đến hot reload chậm
import '@/assets/styles/tailwind.scss'
// Native UI CSS
const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)
// Custom CSS
import '@/assets/styles/index.scss'

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)
pinia.use(({ store }) => {
  store.$router = markRaw(router)
})

app.use(router)
app.use(pinia)
app.use(i18n)

const appStore = useAppStore()
appStore.setLocale(appStore.i18nLocale)

import { Icon } from '@iconify/vue'
// eslint-disable-next-line vue/multi-word-component-names
app.component('Icon', Icon)

import axios from '@/configs/axios'
axios.init()

app.mount('#app')
