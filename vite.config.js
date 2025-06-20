import { defineConfig } from 'vite'

export default defineConfig({
  base: '/fraud-detection-dashboard/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})