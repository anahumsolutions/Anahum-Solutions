/**
 * Local dev server for the chatbot only (no Vite, no site build needed).
 *
 *   cd chatbot && npm run dev      ->  http://localhost:3100
 *
 * Serves the widget files, the test page, the site's real design tokens (so the
 * widget looks exactly as it will on the site) and POST /api/chat.
 */

import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const chatbotRoot = path.resolve(here, '..')
const siteTokens = path.resolve(chatbotRoot, '../src/css/tokens.css')

try {
  process.loadEnvFile(path.join(chatbotRoot, '.env'))
} catch {
  /* no .env file: fine, env vars may come from the shell */
}

const { default: chatHandler } = await import('../api/chat.js')

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
}

const routes = {
  '/': path.join(here, 'index.html'),
  '/chatbot.js': path.join(chatbotRoot, 'public/chatbot.js'),
  '/chatbot.css': path.join(chatbotRoot, 'public/chatbot.css'),
  '/site-tokens.css': siteTokens,
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')

  if (pathname === '/api/chat') return chatHandler(req, res)

  const file = routes[pathname]
  if (!file) {
    res.statusCode = 404
    return res.end('Not found')
  }
  try {
    const body = await readFile(file)
    res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream')
    res.setHeader('Cache-Control', 'no-store')
    res.end(body)
  } catch {
    res.statusCode = 500
    res.end('Could not read file')
  }
})

const port = Number(process.env.PORT) || 3100
server.listen(port, () => {
  const mode =
    process.env.CHATBOT_MOCK === '1'
      ? 'MOCK replies'
      : process.env.GEMINI_API_KEY
        ? 'live model'
        : 'NO API KEY (set one in chatbot/.env)'
  console.log(`anahum chatbot dev server: http://localhost:${port}  [${mode}]`)
})
