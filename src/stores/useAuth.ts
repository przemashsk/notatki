import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuth = defineStore('auth', {
  state: () => ({ user: null as User | null, initializing: true }),
  actions: {
    async listen() {
      // pierwszy strzał – czy jest aktywna sesja
      const { data } = await supabase.auth.getSession()
      this.user = data.session?.user ?? null
      this.initializing = false

      // eventy w trakcie działania aplikacji
      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user ?? null
      })
    },
    // signInWithGoogle() {
    //   return supabase.auth.signInWithOAuth({ provider: 'google' })
    // },
    // useAuth.ts
    async signInWithGooglex() {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            // prompt: 'select_account',   // ← kluczowa linijka
          },
        },
      })
    },
    async signInWithGoogle() {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // queryParams: { prompt: 'select_account' },
          // zawsze wróci dokładnie tam, skąd wywołano (działa w dev i prod)
          redirectTo: window.location.origin,
        },
      })
    },


    signOut() {
      return supabase.auth.signOut()
    },
  },
})
