import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import string from 'vite-plugin-string'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    string({
      include: ['**/*.csv'], // for importing CSVs
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
})
