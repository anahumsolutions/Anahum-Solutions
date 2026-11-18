import { defineConfig } from 'vite'
import injectHTML from 'vite-plugin-html-inject'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [injectHTML()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        work: fileURLToPath(new URL('./work.html', import.meta.url)),
      },
    },
  },
})
