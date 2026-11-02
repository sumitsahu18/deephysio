import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
<<<<<<< HEAD
    // /api aur /uploads -> Express backend (npm run server, port 5000)
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
=======
    // Backend banne ke baad /api calls Express server (port 5000) par jayengi
    proxy: {
      '/api': 'http://localhost:5000',
>>>>>>> 7f723cae747664c324f371ef57f411b38bbad52e
    },
  },
})
