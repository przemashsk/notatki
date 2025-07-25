import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'   // 👈 1

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // base: '/notatki/',
  resolve: {                                    // 👈 2
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
