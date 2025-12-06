import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'zustand'],
          'map-vendor': ['leaflet', 'react-leaflet', 'leaflet.heat'],
          'chart-vendor': ['recharts', 'react-force-graph-2d'],
          'ui-vendor': ['lucide-react'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['leaflet']
  }
})
