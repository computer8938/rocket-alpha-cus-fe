import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api/scraper': {
          target: env.VITE_SCRAPER_PROXY_TARGET ?? 'http://localhost:8081',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/scraper/, ''),
        },
        '/api/auth': {
          target: env.VITE_AUTH_PROXY_TARGET ?? 'http://localhost:8090',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/auth/, ''),
        },
        '/api/customer': {
          target: env.VITE_CUSTOMER_PROXY_TARGET ?? 'http://localhost:8091',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/customer/, ''),
        },
        '/api/processor': {
          target: env.VITE_PROCESSOR_PROXY_TARGET ?? 'http://localhost:8082',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/processor/, ''),
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
  }
})
