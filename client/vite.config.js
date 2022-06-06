import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@scss': path.resolve(__dirname, './src/assets/scss'),
      '@img': path.resolve(__dirname, './src/assets/img'),
      '@ico': path.resolve(__dirname, './src/assets/ico'),
      '@comps': path.resolve(__dirname, './src/components'),
    },
  },
  server: {
    proxy: {
      '/refresh_token': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
        rewrite: (tokenPath) => tokenPath.replace(/^\/api/, ''),
      },
      '/lyrics': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
        rewrite: (lyricsPath) => lyricsPath.replace(/^\/api/, ''),
      },
    },
  },
});
