# anahum chatbot

A self-contained chatbot for the anahum website. It lives entirely in this folder. Nothing in `src/`, `index.html` or the rest of the site has to change except one `<script>` tag.

```
chatbot/
├── public/
│   ├── chatbot.js     Embeddable widget (vanilla JS, Shadow DOM, no dependencies)
│   └── chatbot.css    Widget styles, driven by the site's design tokens
├── api/
│   └── chat.js        Serverless endpoint: POST /api/chat -> { reply }
├── lib/
│   └── knowledge.js   Everything the bot may say (services, pricing, process) + system prompt
├── dev/               Local test server and test page (not deployed behavior)
├── vercel.json
├── .env.example
└── package.json
```

## How it works

1. The widget shows a floating chat button. It keeps the conversation in `sessionStorage`.
2. Each message goes to `/api/chat` with the recent history.
3. `api/chat.js` adds the system prompt from `lib/knowledge.js`, calls the Gemini API, and returns the reply. The API key stays on the server.

The bot only answers from `lib/knowledge.js`. For anything else (custom quotes, contact details, client names) it points visitors to "Book a call".

## Try it locally

```bash
cd chatbot
cp .env.example .env        # then put your GEMINI_API_KEY in it
npm run dev                 # http://localhost:3100
```

No key yet? `npm run dev:mock` returns canned replies so you can check the UI.

## Deploy

The chatbot is its own small Vercel project, so the website's build and structure stay untouched.

1. In Vercel, **Add New Project**, import this same repo, and set **Root Directory** to `chatbot`. Framework preset: **Other**.
2. Add environment variables: `GEMINI_API_KEY`, and `ALLOWED_ORIGINS` set to your site URL (for example `https://anahum-web-new.vercel.app`).
3. Deploy. You get a URL like `https://anahum-chatbot.vercel.app`.

## Add it to the website

Add one line to the site's `index.html`, just before `</body>`:

```html
<script src="https://anahum-chatbot.vercel.app/chatbot.js" defer></script>
```

Replace the domain with your chatbot deployment. The widget finds its CSS and API from the same domain automatically.

Optional attributes on that tag:

| Attribute       | Purpose                  | Default                            |
| --------------- | ------------------------ | ---------------------------------- |
| `data-endpoint` | Full URL of the chat API | `/api/chat` on the script's domain |
| `data-title`    | Panel title              | `anahum assistant`                 |
| `data-greeting` | First message            | Short welcome line                 |
| `data-position` | `right` or `left`        | `right`                            |

From your own buttons you can call `window.anahumChatbot.open()`, for example on "Book a call".

## Keeping answers accurate

When prices, services or process steps change on the site, update `lib/knowledge.js` and redeploy. That file is the only source of truth for the bot.

## Notes

- Rate limit is 20 messages per minute per IP. It is in memory, so it is best-effort on serverless. For hard limits, add Vercel's firewall rate limiting.
- Messages are trimmed (1,000 characters each, last 12 sent to the model) to keep cost predictable.
- The widget uses `var(--ember)`-style tokens from `src/css/tokens.css`, so a palette change on the site carries over automatically.
