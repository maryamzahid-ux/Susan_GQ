import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Proxies /api/anthropic -> https://api.anthropic.com and injects your API key
// from the ANTHROPIC_API_KEY environment variable (.env file). This keeps the
// key OFF the client and lets the in-app AI Coach work on localhost.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/anthropic': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/anthropic/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.ANTHROPIC_API_KEY) {
                proxyReq.setHeader('x-api-key', env.ANTHROPIC_API_KEY)
                proxyReq.setHeader('anthropic-version', '2023-06-01')
              }
            })
          },
        },
      },
    },
  }
})
