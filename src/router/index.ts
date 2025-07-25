// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/useAuth'

const routes = [
  { path: '/', component: () => import('@/pages/Dashboard.vue') },
  { path: '/login', component: () => import('@/pages/Login.vue') },
  { path: '/note/:id', component: () => import('@/pages/NoteDetail.vue') },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to) => {
  const auth = useAuth()

  // 1· poczekaj aż Pinia załaduje sesję (np. auth.listen() w main.ts)
  if (auth.initializing) return false

  // 2· brak usera --> zawsze /login
  if (!auth.user && to.path !== '/login') return '/login'

  // 3· jest user a trafia na /login --> przekieruj na dashboard
  if (auth.user && to.path === '/login') return '/'

  // 4· w pozostałych przypadkach pozwól przejść
})

export default router
