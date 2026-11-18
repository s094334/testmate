import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
  // `npm run dev:api` (wrangler dev) has to be running for /api to answer
  server: {
    proxy: {
      // Object form on purpose: the string shorthand turns on changeOrigin,
      // which sends Host: localhost:8787 while the browser's Origin is the
      // Vite address, and worker/http/origin.ts then answers 403.
      '/api': { target: 'http://localhost:8787' },
    },
  },
})
