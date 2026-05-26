import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://ec2-51-20-254-227.eu-north-1.compute.amazonaws.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
