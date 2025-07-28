import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { version } from './package.json'

import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'   // 👈 1

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // base: '/notatki/',

  base: './', // lub '/' jeśli hostujesz z root domeny
  resolve: {                                    // 👈 2
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
})
