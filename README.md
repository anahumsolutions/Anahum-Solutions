# Anahum Solutions — AI Agency Website

**The quiet intelligence behind your brand.**

The official website of **Anahum Solutions**, an AI-powered digital agency building intelligent digital experiences, automation systems, and creative solutions for modern businesses.

🌐 **Live Website:** [anahum-web-new.vercel.app](https://anahum-web-new.vercel.app)

---

## About the Project

This repository contains the source code for the official Anahum Solutions website. It is designed to communicate the agency's services, brand identity, capabilities, and vision through a modern digital experience.

The website combines a carefully structured visual system, responsive layouts, motion-driven interactions, and an integrated AI chatbot to create an elegant and engaging experience for visitors.

The AI chatbot acts as a virtual assistant, helping visitors explore the agency's services, understand its offerings, and learn about its working process directly through the website.

## Services

Anahum Solutions specializes in:

- **AI Automation:** Intelligent workflows, AI agents, and business process automation.
- **Web Development:** Modern, responsive, and high-performance websites.
- **Application Development:** Custom web and software applications.
- **AI-Powered Content Creation:** AI-generated visual content and creative assets for brands.
- **Custom AI Solutions:** Tailored artificial intelligence solutions for business needs.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive layouts |
| Vanilla JavaScript | Website interactions and application logic |
| Vite | Development server and production build |
| GSAP | Motion graphics and animations |
| Bootstrap 5.3 | UI and supporting components |
| Google Gemini API | AI-powered chatbot responses |
| Node.js | Chatbot API runtime |
| Vercel Serverless Functions | Chatbot backend deployment |
| Shadow DOM | Isolated chatbot widget interface |
| Session Storage | Conversation history during the browser session |

## Getting Started

### Prerequisites

- Node.js 20 or later recommended
- npm 9 or later
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/anahumsolutions/Anahum-Solutions.git
```

Navigate into the project:

```bash
cd Anahum-Solutions
```

Install dependencies:

```bash
npm ci
```

### Development

Start the local development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

### Production Build

Generate an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
├── brand/                  # Brand guidelines and identity
├── evidence/               # Reference frames and design specifications
├── icons/                  # SVG icon resources
├── public/                 # Static assets
├── scripts/                # Automation and generation scripts
├── src/
│   ├── css/
│   │   ├── tokens.css      # Design tokens and visual variables
│   │   ├── base.css        # Typography and global styles
│   │   ├── layout.css      # Structural layouts and grids
│   │   ├── components.css  # Reusable UI components
│   │   └── sections.css    # Page-specific styles
│   ├── js/
│   │   ├── anim/           # Modular GSAP animations
│   │   └── main.js         # Application entry point
│   └── partials/           # Reusable HTML partials
├── chatbot/
│   ├── public/
│   │   ├── chatbot.js      # Embeddable chatbot widget
│   │   └── chatbot.css     # Chatbot styles
│   ├── api/
│   │   └── chat.js         # Serverless chat API endpoint
│   ├── lib/
│   │   └── knowledge.js    # Chatbot knowledge base and system prompt
│   ├── dev/                # Local chatbot testing environment
│   ├── vercel.json         # Chatbot deployment configuration
│   ├── .env.example        # Chatbot environment variables template
│   └── package.json        # Chatbot dependencies and scripts
├── .github/
│   └── workflows/          # GitHub Actions CI workflows
├── .husky/                 # Git hooks
├── index.html              # Main HTML entry point
├── package.json            # Website dependencies and scripts
├── vercel.json             # Website deployment configuration
├── README.md
├── CONTRIBUTING.md
├── THEMING.md
└── ...
```

## Integrated AI Chatbot

Anahum Solutions features an AI-powered chatbot integrated directly into the website to provide visitors with instant assistance and information about the agency.

The chatbot is designed as a lightweight, self-contained widget that operates independently of the website's main application code while remaining seamlessly integrated into its user experience.

### Features

- Floating chat button accessible throughout the website.
- Interactive conversational interface.
- AI-generated responses powered by Google Gemini.
- Knowledge-grounded answers based on the agency's information.
- Session-based conversation history using `sessionStorage`.
- Responsive interface with isolated styles through Shadow DOM.
- Server-side API key protection.
- Configurable chatbot title, greeting, position, and API endpoint.
- Rate limiting and message-length restrictions.
- Independent backend deployment without changing the main website build.

### Architecture

The chatbot follows a client-server architecture.

```text
                 ANAHUM WEBSITE
                       |
                       |
                index.html
                       |
              chatbot.js script
                       |
                       v
               CHATBOT WIDGET
                 (Frontend)
                       |
                 User Message
                       |
                       v
              POST /api/chat
                       |
                       v
              SERVERLESS API
                (chat.js)
                       |
             System Prompt + History
                       |
                       v
               KNOWLEDGE BASE
              (knowledge.js)
                       |
                       v
               GOOGLE GEMINI
                       |
                 AI Response
                       |
                       v
                CHATBOT WIDGET
                       |
                       v
                  VISITOR
```

### How It Works

1. **Widget Initialization:** The website loads `chatbot.js` through a script tag. The widget creates a floating chat button and conversational interface.
2. **Conversation Management:** Messages and recent conversation history are maintained in `sessionStorage`.
3. **API Communication:** Each user message is sent to the chatbot backend through a POST request to `/api/chat`.
4. **Knowledge Integration:** The backend retrieves the system prompt and agency information from `lib/knowledge.js`.
5. **AI Processing:** The backend sends the system prompt and conversation history to the Google Gemini API.
6. **Response Delivery:** Gemini generates a response, which is returned to the widget and displayed to the visitor.

### Knowledge Base & Response Handling

The chatbot uses `lib/knowledge.js` as its centralized source of information.

It contains information about:

- Agency services and capabilities.
- Available offerings and pricing information.
- Working processes and project workflows.
- Instructions governing chatbot responses.

The chatbot is designed to answer questions using the information available in its knowledge base.

For requests involving custom quotations, specific client details, or contact information that is not available in the knowledge base, visitors are directed to **Book a Call**.

When agency information or services change, update `lib/knowledge.js` and redeploy the chatbot backend to keep responses accurate.

### Local Chatbot Development

The chatbot has its own development environment inside the `chatbot/` directory.

Navigate into the chatbot folder:

```bash
cd chatbot
```

Install its dependencies if required:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Add your Gemini API key to `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
ALLOWED_ORIGINS=http://localhost:5173
```

Start the chatbot development server:

```bash
npm run dev
```

The local testing environment is available at:

```text
http://localhost:3100
```

#### Mock Mode

If a Gemini API key is unavailable, use mock mode to test the chatbot interface with predefined responses:

```bash
npm run dev:mock
```

Mock mode is intended for local UI testing and does not represent production AI behavior.

### Environment Variables

The chatbot backend requires the following environment variables:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key used for AI responses |
| `ALLOWED_ORIGINS` | Website origins permitted to access the chatbot API |

**Security:** The Gemini API key is stored in server-side environment variables and must never be exposed in frontend JavaScript or committed to the repository.

### Chatbot Deployment

The chatbot backend is deployed independently through Vercel while remaining integrated into the main Anahum Solutions website.

This separation allows the chatbot backend to be maintained and updated without modifying the website's main application or build configuration.

#### Deployment Steps

1. Open Vercel and select **Add New Project**.
2. Import the Anahum Solutions GitHub repository.
3. Set the Root Directory to `chatbot`.
4. Select **Other** as the framework preset.
5. Configure the environment variables:
   - `GEMINI_API_KEY`
   - `ALLOWED_ORIGINS` with the production website URL.
6. Deploy the project.

The deployment generates a chatbot-specific URL, for example:

```text
https://anahum-chatbot.vercel.app
```

The deployed chatbot provides the widget assets and API endpoint.

### Website Integration

The chatbot is integrated into the main website through a single script tag in the root `index.html` file, immediately before the closing `</body>` tag.

```html
<script
  src="https://anahum-chatbot.vercel.app/chatbot.js"
  defer
></script>
```

Replace the example domain with the actual chatbot deployment URL.

The widget automatically resolves its CSS and API endpoint from its deployment domain.

#### Optional Configuration

The chatbot supports the following script attributes:

| Attribute | Purpose | Default |
|---|---|---|
| `data-endpoint` | Full URL of the chat API | `/api/chat` on the script's domain |
| `data-title` | Chat panel title | `anahum assistant` |
| `data-greeting` | Initial welcome message | Default welcome message |
| `data-position` | Widget position (`right` or `left`) | `right` |

Example:

```html
<script
  src="https://anahum-chatbot.vercel.app/chatbot.js"
  data-title="Anahum Assistant"
  data-position="right"
  defer
></script>
```

The chatbot also exposes a JavaScript interface that allows website buttons to open the chat panel programmatically:

```javascript
window.anahumChatbot.open();
```

This can be used to connect existing website buttons, such as **Book a Call**, with the chatbot experience.

### Performance & Limitations

- The chatbot widget is built using vanilla JavaScript with no frontend framework dependencies.
- Shadow DOM isolates the widget's interface and styles from the website.
- Messages are limited to 1,000 characters each.
- The last 12 messages are sent as conversation history to the AI model.
- Rate limiting is configured for 20 messages per minute per IP.
- The rate limiter uses in-memory storage and is best-effort in a serverless environment. Vercel Firewall rate limiting can be used for stronger enforcement.

## Design System & Customization

The website follows a centralized design system to maintain visual consistency.

- **Colors and design tokens:** Managed in `src/css/tokens.css`.
- **Typography and global styles:** Managed in `src/css/base.css`.
- **Layout:** Managed in `src/css/layout.css`.
- **Reusable components:** Managed in `src/css/components.css`.
- **Section styling:** Managed in `src/css/sections.css`.
- **Animations:** Organized into modular files under `src/js/anim/`.
- **Icons:** Shared SVG resources are maintained in `icons/` and `src/partials/`.

The chatbot uses its own stylesheet and is isolated through Shadow DOM. Its visual styling is designed to align with the website's design tokens.

For detailed customization instructions, see [THEMING.md](THEMING.md).

## Development Standards

This repository follows consistent development standards to maintain code quality and collaboration.

- **Conventional Commits:** Commit messages follow the Conventional Commits specification.
- **Prettier:** Code formatting is standardized across the project.
- **Husky:** Git hooks validate formatting and commit messages locally.
- **GitHub Actions:** Automated checks run on pull requests targeting `main`.
- **Protected Main Branch:** Direct updates to `main` are restricted to the repository owner.

### Before Contributing

All contributors must read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes.

Contributions should be developed on separate branches and submitted through Pull Requests. Changes must pass the required automated checks before being merged.

## Deployment

The main website and chatbot backend use separate Vercel deployments.

| Component | Deployment | Purpose |
|---|---|---|
| Main Website | Vercel | Hosts the Anahum Solutions website |
| Chatbot Backend | Vercel | Hosts chatbot widget assets and serverless API |

### Main Website Deployment

Deploy using Vercel CLI:

```bash
npx vercel --prod
```

Alternatively:

1. Connect the GitHub repository to Vercel.
2. Configure the project using Vite build settings.
3. Set the production branch to `main`.
4. Deploy the project.

The root `vercel.json` contains the website's deployment and caching configuration.

### Chatbot Deployment

The chatbot is deployed separately using the same GitHub repository with `chatbot/` configured as the Vercel Root Directory.

This separation keeps chatbot functionality independent while allowing it to operate as an integrated feature of the website.

## Documentation

| Document | Description |
|---|---|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution rules and development workflow |
| [THEMING.md](THEMING.md) | Brand customization and visual system |
| [MANIFEST.md](MANIFEST.md) | Project documentation and specifications |
| [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) | Design decisions and open items |

## License & Usage

This repository contains proprietary website source code and brand assets belonging to Anahum Solutions.

Public repository visibility does not grant permission to reuse, redistribute, or commercially exploit its contents. All rights are reserved by Anahum Solutions unless otherwise stated.

---

**Anahum Solutions**

*Building intelligent digital experiences for modern businesses.*

Website: [anahum-web-new.vercel.app](https://anahum-web-new.vercel.app)

GitHub: [github.com/anahumsolutions](https://github.com/anahumsolutions)