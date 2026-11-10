# Anahum Solutions — AI Agency Website

**The quiet intelligence behind your brand.**

The official website of **Anahum Solutions**, an AI-powered digital agency building intelligent digital experiences, automation systems, and creative solutions for modern businesses.

🌐 **Live Website:** [anahum-web-new.vercel.app](https://anahum-web-new.vercel.app)

---

## About the Project

This repository contains the source code for the official Anahum Solutions website. It is designed to communicate the agency's services, brand identity, capabilities, and vision through a modern digital experience.

The website combines a carefully structured visual system, responsive layouts, and motion-driven interactions to create an elegant and engaging experience.

## Services

Anahum Solutions specializes in:

- **AI Automation:** Intelligent workflows, AI agents, and business process automation.
- **Web Development:** Modern, responsive, and high-performance websites.
- **Application Development:** Custom web and software applications.
- **AI-Powered Content Creation:** AI-generated visual content and creative assets for brands.
- **Custom AI Solutions:** Tailored artificial intelligence solutions for business needs.

## Technology Stack

| Technology         | Purpose                                 |
| ------------------ | --------------------------------------- |
| HTML5              | Website structure                       |
| CSS3               | Styling and responsive layouts          |
| Vanilla JavaScript | Interactions and application logic      |
| Vite               | Development server and production build |
| GSAP               | Motion graphics and animations          |
| Bootstrap 5.3      | UI and supporting components            |

## Getting Started

### Prerequisites

- Node.js 20 or later recommended
- npm 9 or later

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
├── .github/
│   └── workflows/          # GitHub Actions CI workflows
├── .husky/                 # Git hooks
├── index.html              # Main HTML entry point
├── package.json            # Dependencies and scripts
├── vercel.json             # Vercel deployment configuration
├── README.md
├── CONTRIBUTING.md
├── THEMING.md
└── ...
```

## Design System & Customization

The website follows a centralized design system to maintain visual consistency.

- **Colors and design tokens:** Managed in `src/css/tokens.css`.
- **Typography and global styles:** Managed in `src/css/base.css`.
- **Layout:** Managed in `src/css/layout.css`.
- **Reusable components:** Managed in `src/css/components.css`.
- **Section styling:** Managed in `src/css/sections.css`.
- **Animations:** Organized into modular files under `src/js/anim/`.
- **Icons:** Shared SVG resources are maintained in the `icons/` and `src/partials/` directories.

For detailed customization instructions, see [THEMING.md](THEMING.md).

## Development Standards

This repository follows consistent development standards to maintain code quality and collaboration.

- **Conventional Commits:** Commit messages must follow the Conventional Commits specification.
- **Prettier:** Code formatting is standardized across the project.
- **Husky:** Git hooks validate formatting and commit messages locally.
- **GitHub Actions:** Automated checks run on pull requests targeting `main`.
- **Protected Main Branch:** Direct updates to `main` are restricted to the repository owner.

### Before Contributing

All contributors must read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes.

Contributions should be developed on separate branches and submitted through Pull Requests. Changes must pass the required automated checks before being merged.

## Deployment

The project is configured for deployment through Vercel.

### Deploy using Vercel CLI

```bash
npx vercel --prod
```

### Deploy through GitHub

1. Connect the GitHub repository to Vercel.
2. Configure the project using Vite build settings.
3. Set the production branch to `main`.
4. Deploy the project.

The included `vercel.json` contains the project's deployment and caching configuration.

## Documentation

| Document                               | Description                                 |
| -------------------------------------- | ------------------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md)     | Contribution rules and development workflow |
| [THEMING.md](THEMING.md)               | Brand customization and visual system       |
| [MANIFEST.md](MANIFEST.md)             | Project documentation and specifications    |
| [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) | Design decisions and open items             |

## License & Usage

This repository contains proprietary website source code and brand assets belonging to Anahum Solutions.

Public repository visibility does not grant permission to reuse, redistribute, or commercially exploit its contents. All rights are reserved by Anahum Solutions unless otherwise stated.

---

**Anahum Solutions**

_Building intelligent digital experiences for modern businesses._

Website: [https://anahum-web-new.vercel.app](https://anahum-web-new.vercel.app)

GitHub: [https://github.com/anahumsolutions](https://github.com/anahumsolutions)
