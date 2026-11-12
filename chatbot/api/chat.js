/**
 * POST /api/chat
 *
 * Body:     { "messages": [{ "role": "user" | "assistant", "content": "..." }] }
 * Response: { "reply": "..." }
 *
 * Plain Node (req, res) handler: runs as a Vercel serverless function and under
 * chatbot/dev/server.js with no changes. The API key never reaches the browser.
 *
 * Env vars:
 *   GEMINI_API_KEY   required (unless CHATBOT_MOCK=1). Get one at https://aistudio.google.com/apikey
 *   CHATBOT_MODEL    optional, default gemini-3.8-flash (any model code from AI Studio works)
 *   ALLOWED_ORIGINS  optional, comma-separated, e.g. https://anahum-web-new.vercel.app
 *   CHATBOT_MOCK     optional, "1" returns canned replies (local testing only)
 */

import { SYSTEM_PROMPT } from '../lib/knowledge.js';

const MODEL = process.env.CHATBOT_MODEL || 'gemini-3.8-flash';
const MAX_HISTORY = 12; // messages sent to the model
const MAX_CHARS = 1000; // per message
// Generous on purpose: some Gemini models spend part of this budget on internal
// reasoning, and a tight cap can leave an empty visible reply. Reply length is
// kept short by the system prompt ("under 90 words"), not by this cap.
const MAX_TOKENS = 1024;
const TIMEOUT_MS = 20000;

const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 60_000; // per minute, per IP (best-effort on serverless)
const hits = new Map();

function allowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

function setCors(req, res) {
  const allowed = allowedOrigins();
  const origin = req.headers.origin;
  if (allowed.length === 0) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (typeof fwd === 'string' && fwd.split(',')[0].trim()) || req.socket?.remoteAddress || 'unknown';
}

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    if (hits.size > 5000) {
      for (const [key, value] of hits) if (now > value.reset) hits.delete(key);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

async function readBody(req) {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 50_000) throw new Error('payload too large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

/** Validate + trim the history so a client cannot send huge or malformed input. */
function sanitize(messages) {
  if (!Array.isArray(messages)) return [];
  const clean = [];
  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) continue;
    if (typeof m.content !== 'string') continue;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (!content) continue;
    const last = clean[clean.length - 1];
    if (last && last.role === m.role) {
      last.content = `${last.content}\n${content}`.slice(0, MAX_CHARS * 2);
    } else {
      clean.push({ role: m.role, content });
    }
  }
  const recent = clean.slice(-MAX_HISTORY);
  while (recent.length && recent[0].role !== 'user') recent.shift();
  return recent;
}

function mockReply(lastUser) {
  const q = lastUser.toLowerCase();
  if (q.includes('price') || q.includes('cost') || q.includes('much')) {
    return 'We have two plans. Starter Engine is $29 per month. Scale Intelligence is $79 per month. Annual billing saves about 25%.';
  }
  if (q.includes('service')) {
    return 'We build four things:\n- AI workflow automation\n- AI product visuals\n- AI agents and chatbots\n- Custom AI systems';
  }
  return '(mock reply) This is a local test response. Set GEMINI_API_KEY to talk to the real assistant.';
}

async function askModel(messages) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`;
    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        // Header (not ?key=) so the key never appears in URLs or request logs.
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        // Gemini calls the assistant role "model".
        contents: messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: { maxOutputTokens: MAX_TOKENS, temperature: 0.4 },
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`upstream ${response.status}: ${detail.slice(0, 300)}`);
    }
    const data = await response.json();
    if (data.promptFeedback?.blockReason) {
      throw new Error(`blocked by model: ${data.promptFeedback.blockReason}`);
    }
    const candidate = data.candidates?.[0];
    const text = (candidate?.content?.parts || [])
      .filter((part) => typeof part.text === 'string' && !part.thought)
      .map((part) => part.text)
      .join('')
      .trim();
    if (!text) throw new Error(`empty model reply (finishReason: ${candidate?.finishReason || 'none'})`);
    return text;
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return send(res, 405, { error: 'Method not allowed.' });
  }

  // Block browser requests from origins that are not on the allow-list.
  const allowed = allowedOrigins();
  if (allowed.length && req.headers.origin && !allowed.includes(req.headers.origin)) {
    return send(res, 403, { error: 'Origin not allowed.' });
  }

  if (rateLimited(clientIp(req))) {
    res.setHeader('Retry-After', '60');
    return send(res, 429, { error: 'Too many messages. Please wait a minute and try again.' });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { error: 'Invalid request body.' });
  }

  const messages = sanitize(body?.messages);
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return send(res, 400, { error: 'Send at least one user message.' });
  }

  if (process.env.CHATBOT_MOCK === '1') {
    return send(res, 200, { reply: mockReply(messages[messages.length - 1].content) });
  }
  if (!process.env.GEMINI_API_KEY) {
    console.error('[chatbot] GEMINI_API_KEY is not set');
    return send(res, 500, { error: 'The assistant is not configured yet.' });
  }

  try {
    const reply = await askModel(messages);
    return send(res, 200, { reply });
  } catch (error) {
    console.error('[chatbot]', error?.message || error);
    return send(res, 502, { error: 'The assistant is unavailable right now. Please try again shortly.' });
  }
}
