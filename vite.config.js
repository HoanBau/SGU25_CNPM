import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // tự động cập nhật service worker
      manifest: {
        name: 'FoodFast Delivery',
        short_name: 'FoodFast',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ff4d4d',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    host: true, // cho phép truy cập LAN
    port: 5173, // port dev server
  },
  build: {
    chunkSizeWarningLimit: 1000, // tăng giới hạn cảnh báo chunk lớn
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // tách dependencies ra chunk riêng
          }
        }
      }
    }
  }
})
