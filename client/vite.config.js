import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@scss': path.resolve(__dirname, './src/assets/scss'),
      '@ico': path.resolve(__dirname, './src/assets/ico')
    }
  }
})
