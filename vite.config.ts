import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relative base so the build runs from any static host (including a Tiiny Host ZIP).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
  },
})
