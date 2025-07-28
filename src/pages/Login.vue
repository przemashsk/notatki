<template>
    <div
        class="h-full flex flex-col items-center justify-center gap-8 p-6 bg-gradient-to-br from-emerald-50 to-sky-100">
        <h1 class="text-4xl font-extrabold text-emerald-700 drop-shadow-md">Notatki</h1>

        <!-- Ładny przycisk Google -->
        <button
            class="flex items-center gap-3 px-6 py-3 rounded-xl bg-white border border-gray-300 shadow hover:bg-gray-100 active:scale-95 transition"
            @click="signIn">
            <!-- Ikona Google (SVG) -->
            <svg class="w-5 h-5" viewBox="0 0 533.5 544.3" aria-hidden="true">
                <path fill="#4285F4"
                    d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.4H272v95.3h146.9c-6.3 33.9-25.1 62.6-53.5 81.6l86.4 67.1c50.3-46.4 81.7-114.7 81.7-193.6z" />
                <path fill="#34A853"
                    d="M272 544.3c71.4 0 131.4-23.6 175.2-64l-86.4-67.1c-24 16.1-54.9 25.5-88.8 25.5-68.4 0-126.4-46.2-147.1-108.2l-88.3 68.3c39.6 78.3 120.3 145.5 235.4 145.5z" />
                <path fill="#FBBC05"
                    d="M124.9 330.5c-10.6-31.8-10.6-66.1 0-97.9l-88.3-68.3C5.5 209.3 0 241.5 0 274.1s5.5 64.8 36.6 109.8l88.3-68.3z" />
                <path fill="#EA4335"
                    d="M272 107.7c37.7-.6 73.7 13.3 101.4 37.7l75.5-75.5C379.6 23.9 327.5 0 272 0 156.9 0 76.2 67.2 36.6 145.5l88.3 68.3C145.6 153.9 203.6 107.7 272 107.7z" />
            </svg>
            <span class="font-medium text-gray-700">Zaloguj przez Google</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/stores/useAuth'
const { signInWithGoogle } = useAuth()
function signIn() {
    signInWithGoogle()
}
</script>