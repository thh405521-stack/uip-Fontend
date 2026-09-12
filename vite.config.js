import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxies /api/* to the standalone Laravel backend during development so
// you can call api.get('/api/v1/...') from this app without CORS issues.
// Point the target at wherever `php artisan serve` is running.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
