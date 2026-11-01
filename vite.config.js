import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Backend banne ke baad /api calls Express server (port 5000) par jayengi
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
