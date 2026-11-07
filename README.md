# anahum solutions — AI Agency Website

Official landing page for **anahum solutions** ("The quiet intelligence behind your brand"). Built with vanilla JavaScript, modern CSS architecture, GSAP animations, and Vite. Ready for GitHub and one-click Vercel deployment.

Live Demo: [https://anahum-web-new.vercel.app](https://anahum-web-new.vercel.app)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js `18+` (or `20+` recommended)
- npm `9+`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/anahum-web.git
cd anahum-web

# Install dependencies
npm install
```

### 3. Development Server
Start the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Production Build & Preview
```bash
# Compile and optimize for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠 Project Structure

```
├── brand/               # Brand guidelines HTML & identity tokens
├── evidence/            # Reference frames, measurements & hero design spec
├── icons/               # SVG sprite definitions
├── public/              # Static assets & placeholder photography
├── scripts/             # Measurement & SVG generation automation scripts
├── src/
│   ├── css/
│   │   ├── tokens.css       # Single source of truth for palette & spacing (Zero hex elsewhere!)
│   │   ├── base.css         # Typography, reset, accessibility styles
│   │   ├── layout.css       # Container & structural grid
│   │   ├── components.css   # Buttons, cards, pills, icon tiles
│   │   └── sections.css     # Section-specific styles (Hero, Services, Bento, Pricing, etc.)
│   ├── js/
│   │   ├── anim/            # Modular GSAP animations (hero, tabs, counters, orbit, etc.)
│   │   └── main.js          # App bootstrap & event listeners
│   └── partials/            # Modular HTML partials (hero, header, services, footer, etc.)
├── index.html           # Main entry point with Vite HTML partial injections
├── package.json         # Pinned dependencies (Vite, GSAP, Bootstrap 5.3)
├── vercel.json          # Production deployment configuration & cache headers
├── THEMING.md           # Guide to swapping palettes, icons, and hero artwork
├── OPEN_QUESTIONS.md    # Log of design decisions and resolved items
└── MEASUREMENTS-hero.md # Stage units geometry and measurements spec
```

---

## 🎨 Theming & Brand Customization

- **Colors:** Defined strictly in `src/css/tokens.css`. No color literals (`#hex`) exist outside this file.
- **Icons:** Unified sprite in `src/partials/sprite.html` and `icons/sprite.svg`. All icons use `currentColor`.
- **Hero Scene:** Multi-layer planet and terrain stage scaled with uniform stage units (`--u`). Procedural SVGs can be regenerated via:
  ```bash
  python scripts/generate_hero_scene.py
  ```
For full instructions on changing colors, replacing photography, or retiming motion, refer to [`THEMING.md`](THEMING.md).

---

## ☁️ Deployment (Vercel)

The repository includes a ready-to-deploy `vercel.json` configured for Vite with immutable asset caching.

### Deploy via Vercel CLI
```bash
npx vercel --prod
```

### Deploy via GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Push this codebase:
   ```bash
   git init
   git add .
   git commit -m "feat: initial anahum website codebase"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. Import the repository in [Vercel](https://vercel.com/new) — build settings will be automatically detected.
