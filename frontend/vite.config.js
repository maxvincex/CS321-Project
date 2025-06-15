import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import string from 'vite-plugin-string'

export default defineConfig({
  plugins: [
    vue(),
    string({
      include: ['**/*.csv'],
    }),
  ]
})
