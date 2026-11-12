# anahum Theme & Customization Guide (THEMING.md)

This guide documents how to customize the **anahum solutions** website: changing the color palette, swapping SVG icons, adjusting animation timings, and replacing photography assets.

---

## 1. Changing the Palette

The entire color system is defined in a single file:  
`src/css/tokens.css`

**Hard Rule:** No color literals (`#hex` or `rgb(...)`) exist outside `tokens.css`. Every component, background, border, button, and icon dynamically reads from CSS Custom Properties.

### Core Variables

To change the brand palette, update the root variables in `src/css/tokens.css`:

```css
:root {
  /* Core Brand Colors */
  --ember: #f93d0d; /* Accent color (CTAs, active states, active icons, hover highlights) */
  --maroon: #350600; /* Deep Ink color (dark panels, primary text, dark buttons) */
  --cream: #fffaee; /* Warm White (page background, card surface on dark) */
  --peach: #ffddd5; /* Peach Cream (soft surfaces, pricing bodies, secondary cards) */

  /* RGB channels for transparent glows and overlays */
  --ember-rgb: 249 61 13;
  --maroon-rgb: 53 6 0;

  /* Extended UI tokens */
  --bg: var(--cream);
  --ink: var(--maroon);
  --surface: #fff;
  --soft: var(--peach);
  --accent: var(--ember);
  --on-accent: var(--maroon);
  --muted: #7a5a52;
  --line: rgba(53, 6, 0, 0.14);

  --dark: var(--maroon);
  --dark-card: #2a0600;
  --on-dark: var(--cream);
  --muted-dark: #c9aaa0;

  --dot: var(--ember); /* Logo central core dot */
}
```

### Contrast Guidelines (WCAG AA Compliance)

When adjusting palette colors, ensure text combinations maintain the contrast ratios computed in the brand specification:

| Foreground               | Background               | Computed Ratio | Permitted Usage                                             |
| ------------------------ | ------------------------ | -------------- | ----------------------------------------------------------- |
| Warm White (`--cream`)   | Deep Maroon (`--maroon`) | **17.1:1**     | All text (body, labels, headings)                           |
| Deep Maroon (`--maroon`) | Peach Cream (`--peach`)  | **14.1:1**     | All text                                                    |
| Ember Orange (`--ember`) | Deep Maroon (`--maroon`) | **4.8:1**      | Any size text, icons, highlights                            |
| Deep Maroon (`--maroon`) | Ember Orange (`--ember`) | **4.8:1**      | Text on ember buttons, chips, badges                        |
| Warm White (`--cream`)   | Ember Orange (`--ember`) | **3.5:1**      | Large text (≥24px or bold ≥18px) and icons only             |
| Ember Orange (`--ember`) | Warm White / Cream       | **3.5:1**      | Large text (≥24px) & decorations only. Never for body text. |
| Muted (`#7a5a52`)        | Warm White (`--cream`)   | **5.9:1**      | Supporting / secondary text                                 |
| Muted Dark (`#c9aaa0`)   | Deep Maroon (`--dark`)   | **8.3:1**      | Supporting text on dark surfaces                            |

---

## 1.1 Hero Planet & Terrain Customization

The hero section features a multi-layer planet and terrain composition scaled via `--u`:

### Hero Tokens (in `src/css/tokens.css`):

- `--hero-ground`: Outside-disk background base color (`color-mix(in srgb, var(--maroon) 85%, black)`).
- `--hero-sky-0` through `--hero-sky-7`: Gradient steps for the planet disk atmosphere (crimson-maroon to bright ember orange).
- `--hero-rim`: Planet disk rim color (`var(--peach)`).
- `--hero-rim-edge`: Hard 1px highlight at the disk boundary (`var(--cream)`).
- `--hero-terrain-top`: Ridge line top tone (`color-mix(in srgb, var(--maroon) 65%, black)`).
- `--hero-terrain-base`: Terrain bottom tone (`color-mix(in srgb, var(--maroon) 15%, black)`).

### Regenerating Hero SVGs

All hero SVG layers are generated deterministically with seeded PRNG (`20261018`):

```bash
python scripts/generate_hero_scene.py
```

Outputs:

- `src/partials/hero-terrain.svg`: 2× stage width dark ridge silhouette with turbulence and 35mm grain.
- `src/partials/hero-veins.svg`: Organic light cracks fanning from anchor points with junction and terminal glow dots.
- `src/partials/hero-figure.svg`: Floating human silhouette with subtle ember rim highlight.
- `src/partials/hero-links.svg`: 1px dashed connector lines linking node cards to vein junctions.

### Swapping Terrain Artwork

If custom raster or vector terrain artwork is provided:

1. Optimize as WebP or AVIF (under 250KB) or an SVG.
2. Replace `src/partials/hero-terrain.svg` or embed the artwork inside `<div class="hero__terrain">`.
3. The layout automatically clips to the stage boundaries without shifting nodes or veins.

---

## 2. Swapping Icons and Logo

All UI and social icons are stored in a centralized SVG sprite located in:

- `src/partials/sprite.html` (inlined into HTML for zero-latency, cross-origin file:// compatibility)
- `icons/sprite.svg` (standalone sprite file)

### How to Swap an Icon

1. Open `src/partials/sprite.html`.
2. Locate the `<symbol id="icon-name" viewBox="...">` definition.
3. Replace the SVG path elements.
4. **Mandatory:** Ensure all strokes or fills use `currentColor` or `none`. Do not hard-code hex colors.
5. In HTML, render the icon using:
   ```html
   <svg viewBox="0 0 24 24" aria-hidden="true">
     <use href="#icon-name"></use>
   </svg>
   ```

### Icon Tile Classes

Icon tiles read their color schemes automatically from tokens:

- `.icon-tile--dark`: Maroon background (`--dark`), Ember icon (`--accent`).
- `.icon-tile--light`: White background (`--surface`), Maroon icon (`--ink`).
- `.icon-tile--accent`: Ember background (`--accent`), Maroon icon (`--on-accent`).
- `.icon-tile--soft`: Peach background (`--soft`), Maroon icon (`--ink`).

### Brand Logo Vectors

The original brand vectors are preserved under `#ic` (icon) and `#lk` (lockup).  
The center core dot dynamically inherits `var(--dot, var(--accent))`. Changing `--accent` or `--dot` in `tokens.css` automatically recolors the logo dot.

---

## 3. Retiming Animations

Animations are structured in modular files under `src/js/anim/`:

| Module              | Target                      | Effect                                         | Timing / Config                                                         |
| ------------------- | --------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| `fade-up.js`        | `[data-anim="fade-up"]`     | ScrollTrigger y: 35px -> 0, opacity 0 -> 1     | Adjust duration (default `0.75s`) or specify `data-delay="0.2"` in HTML |
| `blur-reveal.js`    | `[data-anim="blur-reveal"]` | Project cards blur(8px) -> blur(0), y, opacity | Duration `0.85s`, clears filter on complete                             |
| `word-blur.js`      | `[data-anim="word-blur"]`   | Process heading word-by-word reveal            | Duration `0.45s` per word, stagger `0.07s` (~1s total)                  |
| `services-tabs.js`  | `#services`                 | Stacked image crossfade & glass panel swap     | Controlled by `--dur-base: 0.35s` in CSS                                |
| `pricing-toggle.js` | `#pricing`                  | Monthly/Yearly toggle & number tweening        | Duration `0.5s`, `power2.out`                                           |
| `orbit.js`          | `#tools`                    | Satellite card floating                        | Duration `3.0s` to `4.2s`, `sine.inOut`, staggered                      |

### Reduced Motion Support

Every animation honors `prefers-reduced-motion: reduce`. When enabled, elements instantly render in their final state with zero layout shift.

---

## 4. Replacing Photography Assets

All photography assets reside in `public/assets/`.  
When replacing placeholder images, follow the **anahum brand photography rules**:

- **Aesthetic:** Warm cinematic café light, 35mm film grain, wide-angle lens, maroon shadows, cream highlights.
- **Subjects:** Modern workspaces, collaborative architecture, ambient desks, laptops, clean physical objects.
- **Strictly Avoid:** Robots, glowing brains, neon circuit boards, mechanical typewriters, and neon blue or purple lighting.

### Asset Map:

- `hero.jpg` (800×600) — Studio workspace
- `what-we-do.jpg` (720×560) — Collaborative architecture
- `services-1.jpg` to `services-4.jpg` (800×600) — 4 Service showcase images
- `work-1.jpg` to `work-4.jpg` (700×480) — Selected project visuals
- `expert-1.jpg`, `expert-2.jpg` (600×600) — Principal strategist and architect portraits
- `thumb-1.jpg` to `thumb-4.jpg` (300×300) — Team thumbnails

---

## 5. Verification Commands

To verify theme integrity and compliance:

```bash
# 1. Verify build
npm run build

# 2. Check that no hex color literals exist outside tokens.css
python -c "import os, re; p=re.compile(r'#[0-9a-fA-F]{3,8}'); v=[f'{root}/{file}' for root,_,files in os.walk('src/css') for file in files if file!='tokens.css' and p.search(open(f'{root}/{file}').read())]; print('VIOLATIONS:', v) if v else print('TOKEN COMPLIANCE: 100% PASS')"

# 3. Re-run multi-viewport rendering
python scripts/capture_all.py
```

---

## 6. Deploying to Vercel

The project includes an optimized [`vercel.json`](file:///c:/Users/Hasan_asif64/Downloads/Anahum-Web-New/vercel.json) ready for immediate deployment:

- **Framework:** `vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Headers:** Immutable asset caching for `/assets/` (1 year) and standard HTTP security headers (`nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`).

### Live Production Deployment:

- **Production URL:** [https://anahum-web-new.vercel.app](https://anahum-web-new.vercel.app)
- **Deployment Inspector:** [https://vercel.com/hasanasif64s-projects/anahum-web-new](https://vercel.com/hasanasif64s-projects/anahum-web-new)

### Deploy via CLI:

```bash
npx vercel --prod
```

### Deploy via Git / Web:

Push this directory to a GitHub/GitLab repository and import it into Vercel. Vercel will automatically detect `vercel.json` and deploy.
