<template>
    <header class="bg-slate-800 text-white h-14 flex items-center justify-between px-4 shadow">
        <h1 class="font-semibold">Notatki</h1>
        <div class="flex items-center gap-3">
            <span v-if="auth.user" class="text-sm opacity-80 hidden sm:block">
                {{ auth.user.email }}
            </span>
            <button v-if="auth.user" class="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-sm" @click="logout">
                Wyloguj
            </button>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useAuth } from '@/stores/useAuth'
import { useRouter } from 'vue-router'

const auth = useAuth()
const router = useRouter()

async function logout() {
    await auth.signOut()
    router.replace('/login') // wracamy na ekran logowania
}
</script>