import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Aseguramos que el audio se guarde en caché para modo offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
        maximumFileSizeToCacheInBytes: 10485760, // Aumenta el límite a 10 MB
      },
      manifest: {
        name: 'SOSpiro',
        short_name: 'SOSpiro',
        description: 'Herramienta de emergencia para ataques de ansiedad',
        theme_color: '#111827', // Tailwind gray-900
        background_color: '#111827',
        display: 'standalone',
        icons: [
          // Necesitarás crear estos iconos después en la carpeta /public
          { src: '/sospiroIcon.png', sizes: '192x192', type: 'image/png' },
          { src: '/sospiroIcon.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
})