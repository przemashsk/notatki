import router from './index' // lub '../router'
// import { watch } from 'vue'
import { useAuth } from '@/stores/useAuth'
// import type { RouteLocationNormalized } from 'vue-router'

router.beforeEach(async to => {
  const auth = useAuth()
  if (auth.initializing) return false        // poczekaj 1 tick
  if (!auth.user && to.path !== '/login') return '/login'
})

