// vite.config.js
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue'
import string from 'vite-plugin-string'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    string({ include: ['**/*.csv'] }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom', 
    globals: true,         
  },
  server: {
    proxy: {
      // forward any request starting with /api to your Express server
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
