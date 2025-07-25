// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { useAuth } from '@/stores/useAuth'
import App from './App.vue'
import './index.css'

const app = createApp(App)
app.use(createPinia())

// 1️⃣  nasłuchiwanie sesji
await useAuth().listen()

// 2️⃣  dopiero teraz router + mount
app.use(router).mount('#app')
