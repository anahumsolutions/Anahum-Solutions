# Measured Evidence & Geometry Specification

This document records the exact measurements sampled from the evidence (`evidence/frames/*.jpg`, `evidence/footer.png`, and `evidence/motion/*.jpg`) at 1920px width using Pillow and numpy.

All pixel measurements are verified at 1920px desktop resolution.
*Note: In the recording frames (1920×992), the top 90px (y=0..89) is the ThemeForest preview toolbar; the webpage viewport starts at y=90.*

---

## 1. Global & Layout Tokens

| Element | Measured Value | Brand Adaptation | Evidence Source | Status |
|---|---|---|---|---|
| Page Canvas Width | 1920px | 100% full width | `evidence/frames/t000s.jpg` | **Observed** |
| Max Content Container | 1618px wide (x: 147px to 1765px, side margins ~150px) | `max-width: 1618px; margin: 0 auto;` | `evidence/footer.png`, `t020s.jpg` | **Observed** |
| Inner Text Container | 1368px wide (x: 272px to 1640px) | `max-width: 1368px;` | `evidence/footer.png` | **Observed** |
| Scrollbar Width | 7px | `::-webkit-scrollbar { width: 7px; }` | `evidence/footer.png` right edge | **Observed** |
| Scrollbar Thumb | Ember Orange (`#F93D0D`), transparent track | `scrollbar-color: var(--accent) transparent;` | `evidence/footer.png` | **Observed** |
| Back-to-Top Button | 48px × 48px (or 44px × 54px), fixed bottom-right (bottom: 24px, right: 24px) | Ember rectangle (`#F93D0D`), cream up arrow | `evidence/footer.png` bottom right | **Observed** |
| Section Vertical Padding | 120px top / bottom (fluid clamp: 80px to 120px) | `--section-pad: clamp(80px, 8vw, 120px);` | `t002s.jpg`, `t026s.jpg` | **Observed** |

---

## 2. Floating Header & Dropdown Menu

| Element | Measured Value | Brand Treatment | Evidence Source | Status |
|---|---|---|---|---|
| Header Position | `position: fixed; top: 24px; left: 50%; transform: translateX(-50%); z-index: 1000;` | Floating pill | `t000s.jpg` (y=114..174 in recording = 24..84 in viewport) | **Observed** |
| Header Dimensions | Height: 60px, Width: ~540px | `height: 60px; min-width: 520px; border-radius: 9999px;` | `t000s.jpg` (x: 690..1230) | **Observed** |
| Header Background | Dark pill in ref -> Warm Cream pill in brand | `background: var(--cream); border: 1px solid var(--line);` | Section 6 Table | **Observed / Adapted** |
| Header Elements | 1) Brand lockup (min 120px), 2) Hamburger toggle (40×40), 3) CTA button (140×44) | Cream pill, maroon text, ember CTA with maroon text. Open state: ember X button. | `t000s.jpg`, `t068s.jpg` | **Observed** |
| Menu Dropdown | Position: fixed/absolute below header (`top: 92px`), width: ~420px, radius: 24px, padding: 24px | Deep maroon background (`--dark`), cream links, nested flyout for 'Home' | `t068s.jpg`, `t070s.jpg`, `t072s.jpg` | **Observed** |
| Menu Animation | Duration: ~0.35s, Easing: `power2.out`, transform translateY(-10px -> 0) + opacity (0 -> 1) | GSAP timeline | `evidence/motion/motion_t068s-071s.jpg` | **Observed** |

---

## 3. Section: What We Do (Section 7.1)

| Element | Measured Value | Brand Treatment | Evidence Source | Status |
|---|---|---|---|---|
| Section Background | Light background | Warm White (`--cream`: `#FFFAEE`) | `t000s.jpg`, `t002s.jpg` | **Observed** |
| Left Column | Width: ~620px (starts x=150px) | Pill label, Anton headline, Inter paragraph, link | `t002s.jpg` | **Observed** |
| Pill Label | Maroon pill (`--dark`), cream Inter uppercase 11px label, 0.14em tracking, ember 6px dot | `.pill-badge` | Section 6 Table | **Observed** |
| Heading | ~56px Anton, line-height 1.05, two-tone with Instrument Serif italic emphasis | Two-tone headline | `t002s.jpg` | **Observed** |
| Right Column | Width: ~660px, height: ~520px | Main photo + 2 floating stat cards | `t002s.jpg` | **Observed** |
| Main Photo Box | ~520px × 400px, radius 24px | Maroon-toned photography placeholder with grain | `t002s.jpg` | **Observed** |
| Stat Card 1 (Accent) | ~220px × 140px, top-left offset (-30px, -20px), radius 20px | Ember background, cream Anton numeral (`48px`), index `01`, maroon label | `t002s.jpg` | **Observed** |
| Stat Card 2 (Surface) | ~240px × 130px, bottom-right offset (+20px, +30px), radius 20px | White card (`--surface`), maroon bar, index `02`, maroon text | `t002s.jpg` | **Observed** |
| Stagger Motion | Stagger delay: ~0.15s, duration: ~0.7s `power2.out` | GSAP ScrollTrigger batch reveal | `evidence/motion/motion_t004s-007s.jpg` | **Observed** |

---

## 4. Section: Services (Section 7.2)

| Element | Measured Value | Brand Treatment | Evidence Source | Status |
|---|---|---|---|---|
| Layout Grid | 2 columns: Left 4-row accordion/tabs (~600px), Right image card (~680px) | 1368px content width | `t006s.jpg`, `t010s.jpg` | **Observed** |
| Service Row | Height: ~96px, padding: 20px 24px, border-bottom: 1px solid var(--line) | Active row: 4px solid ember indicator on left, dark icon tile (54×54), bold maroon title. Inactive: peach tile, muted text. | `t006s.jpg`, `t010s.jpg` | **Observed** |
| Active Indicator | 4px wide, full row height, square corners, ember (`#F93D0D`) | Left border / pseudo-element | `t006s.jpg` | **Observed** |
| Icon Tile | 54px × 54px, radius: 14px | Active: Deep Maroon (`--dark`) with ember icon. Inactive: Peach (`--soft`). | `t006s.jpg` | **Observed** |
| Right Image Stack | ~640px × 520px, radius: 28px, overflow: hidden | Stacked images with `position: absolute; opacity: 0;` crossfading to `opacity: 1` | `t006s.jpg`, `t010s.jpg` | **Observed** |
| Frosted Glass Overlay | Position: absolute bottom-left (inset ~32px), width: ~540px, padding: 28px, radius: 20px | Maroon at 55% (`rgba(53,6,0,0.55)`), `backdrop-filter: blur(16px)`, cream text, 2 pill chips | `t006s.jpg`, `t010s.jpg` | **Observed** |
| Interaction | Desktop hover/focus, mobile tap | Active tab index updates image opacity | `t006s.jpg` -> `t010s.jpg` | **Observed** |

---

## 5. Section: Dark Bento Panel (Section 7.3)

| Element | Measured Value | Brand Treatment | Evidence Source | Status |
|---|---|---|---|---|
| Outer Dark Panel | Width: 1618px (x: 147px to 1765px), radius: ~48px, background: Deep Maroon (`#350600`) | `--dark: #350600; border-radius: 48px; padding: 64px;` | `t018s.jpg`, `t020s.jpg`, `t024s.jpg` | **Observed** |
| Bento Grid | Multi-card asymmetric grid: 3 top cards, 1 tall right card, 1 bottom card | Grid gap: 24px | `t020s.jpg` | **Observed** |
| Bento Cards | Background: `--dark-card` (`#2a0600`), border: 1px solid rgba(255,250,238,0.1), radius: 24px, padding: 32px | Hover: accent border glow (`rgba(249,61,13,0.3)`) | `t020s.jpg` | **Observed** |
| Checklist Card | Feature checklist with ember square checkmarks | Cream text, ember checks | `t020s.jpg` | **Observed** |
| Feature Cards | Outline ember icons in rounded squares, title, body | `.bento-card--feature` | `t020s.jpg` | **Observed** |
| Tall Tile | Brand logo, tagline, customer avatar stack | Maroon background, cream typography | `t020s.jpg` | **Observed** |
| Logo Marquee | Height: 80px, full bento bottom width, edge masks: `mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent)` | Duplicated track, continuous xPercent loop | `t024s.jpg` | **Observed** |

---

## 6. Section: Selected Works (Section 7.4)

| Element | Measured Value | Brand Treatment | Evidence Source | Status |
|---|---|---|---|---|
| Heading Block | Display title: 'SELECTED WORKS' (~64px Anton uppercase), large numeral '04' to right (~80px Anton ember) | Two-tone heading + ember numeral (>=24px) | `t026s.jpg`, `t028s.jpg` | **Observed** |
| Project Grid | 2 columns, width ~660px per card, gap: 36px | White card container, 1368px content width | `t028s.jpg`, `t030s.jpg` | **Observed** |
| Project Card Header | Title (22px Inter SemiBold) + Category + arrow icon above image, height: ~44px | Maroon text, clean metadata | `t028s.jpg` | **Observed** |
| Project Image Box | ~660px × 460px (approx 16:11), radius: 22px, overflow: hidden | Maroon-toned photography placeholder | `t028s.jpg` | **Observed** |
| Reveal Motion | `filter: blur(8px) -> blur(0); opacity: 0 -> 1; y: 30px -> 0` | GSAP ScrollTrigger, clears filter on complete | `motion_t028s-031s.jpg` | **Observed** |
| Hover State | Image blur(6px) + scale(1.03), Maroon veil (`rgba(53,6,0,0.55)`), centered cream '+' icon in ember circle | Smooth CSS transition (0.35s ease) | `t028s.jpg`, `t030s.jpg` | **Observed** |

---

## 7. Section: Working Process (Section 7.5)

| Element | Measured Value | Brand Treatment | Evidence Source | Status |
|---|---|---|---|---|
| Top Ruler Strip | Height: 24px, repeating tick marks | CSS gradient in `--line` (`repeating-linear-gradient(to right, var(--line) 0, var(--line) 1px, transparent 1px, transparent 16px)`) | `t036s.jpg` | **Observed** |
| Section Heading | Word-by-word blur-to-sharp reveal (duration: ~1.0s total, ~0.08s stagger per word) | Vanilla JS span word splitting + GSAP stagger | `motion_t036s-039s.jpg` | **Observed** |
| 4 Process Cards | 4-column row, card width: ~318px, gap: 24px, radius: 24px, padding: 32px | Alternating Dark / Light: Cards 1 & 3 Maroon-to-black gradient, Cards 2 & 4 White | `t038s.jpg`, `t042s.jpg` | **Observed** |
| Notched Title Chip | 130px × 38px notched badge with icon + step name | Alternating top/bottom placement, alternating ember (with maroon text) and dark | `t042s.jpg` | **Observed** |
| Card Content | Title, description, bottom 'Delivery time' meta row with clock icon | Light cards maroon text; Dark cards cream text | `t042s.jpg` | **Observed** |
| Card Reveal Motion | Cards rise up (`y: 40px -> 0`, `opacity: 0 -> 1`) staggered by ~0.15s after heading completes | GSAP ScrollTrigger timeline | `motion_t036s-039s.jpg` | **Observed** |

---

## 8. Section: Our Experts (Section 7.6)

| Element | Measured Value | Brand Treatment | Evidence Source | Status |
|---|---|---|---|---|
| Outer Dark Panel | 1618px wide, radius: 48px, background: Deep Maroon (`#350600`), padding: 64px | Deep maroon container | `t044s.jpg`, `t046s.jpg` | **Observed** |
| Header Block | Right-aligned heading, pill, and subtitle | Cream text, right-aligned | `t046s.jpg` | **Observed** |
| 2 Large Expert Cards | Width: ~480px, height: ~440px, radius: 24px, overflow: hidden, photo background, name & role badge | Maroon cards, cream typography | `t046s.jpg`, `t050s.jpg` | **Observed** |
| Social Reveal Hover | 4 glass square buttons (44×44px, cream at 12%), reveal on card hover; hovered button turns Ember | `.social-glass-btn` | `t052s.jpg`, `t054s.jpg` | **Observed** |
| 4 Thumbnails Row | Width: 160px × 160px each, radius: 18px | 4 team thumbnail portraits | `t050s.jpg` | **Observed** |
| Overlay CTA Banner | Sits over thumbnail row: 'Meet our team' button + 'Join now ↗' link | Ember button with maroon text + cream link | `t056s.jpg`, `t058s.jpg` | **Observed** |

---

## 9. Section: Features Orbit ('All Tools in One', Section 7.7)

| Element | Measured Value | Brand Treatment | Evidence Source | Status |
|---|---|---|---|---|
| Outer Canvas | 1368px width, min-height: ~780px, centered layout | `--bg` | `t060s.jpg` | **Observed** |
| Central Circle | Diameter: ~440px, Peach Cream (`--soft`: `#FFDDD5`) with pill, Anton heading | Peach background, maroon text | `t060s.jpg` | **Observed** |
| Central Half-Dome | Sits at bottom of circle: Ember dome (`#F93D0D`) over maroon, brand icon, rotated text | SVG arc / CSS radial gradient | `t060s.jpg` | **Observed** |
| Orbit Rings | 3 concentric dotted circles (radii: ~260px, ~360px, ~460px) in `--line` | Clean SVG dotted stroke `stroke-dasharray="4 6"` | `t060s.jpg` | **Observed** |
| Feature Satellite Cards | 6 cards (~180px × 110px) with notched icon tabs, positioned along orbit rings | White/peach cards with maroon icons | `t060s.jpg`, `t066s.jpg` | **Observed** |

---

## 10. Section: Pricing (Section 7.8)

| Element | Measured Value | Brand Treatment | Evidence Source | Status |
|---|---|---|---|---|
| Section Header | Pill label, Anton headline, subtitle, Monthly / Save 25% switch | Pill switch with `aria-pressed` | `t064s.jpg` | **Observed** |
| Pricing Toggle | Pill toggle width: ~260px, height: 48px; 'Monthly' / 'Yearly' with 'Save 25%' ember badge | Cream pill, maroon text, active indicator | `t064s.jpg` | **Observed** |
| 2 Pricing Cards | Width: ~480px each, gap: 40px, radius: 28px, overflow: hidden | Card 1: Starter. Card 2: Scale (Popular). | `t064s.jpg` | **Observed** |
| Card 1 (Starter) | Header: Deep Maroon, body: Peach Cream, price: $29/mo ($260/yr), dark CTA button | Full-width button, checkmarks ember | `t064s.jpg` | **Observed** |
| Card 2 (Popular) | Header: Ember Orange (`#F93D0D`), 'Popular' badge, body: Peach Cream, price: $79/mo ($710/yr), ember CTA | Text on ember header is maroon, checks ember | `t064s.jpg` | **Observed** |
| Feature List | 5-6 features per card, square checkmark in ember (`#F93D0D`) | Inter Regular 15px | `t064s.jpg` | **Observed** |
| Toggle Tween | Animated numeral counter between monthly and annual values | GSAP text tween | `t064s.jpg` | **Observed** |

---

## 11. Section: Footer (Section 7.9 - Frozen Reference Structure)

*Measured directly on `evidence/footer.png` (1919×920):*

| Element | Measured Pixel Value | Implementation Value | Evidence Source | Status |
|---|---|---|---|---|
| Outer Sheet | Full width (1919px), top radius: 100px, white-to-light-gray vertical gradient (`#ffffff` to `#f4f0e6`) | `border-radius: 100px 100px 0 0; background: linear-gradient(to bottom, #ffffff, var(--cream));` | `evidence/footer.png` y: 17..920 | **Observed** |
| Footer Card | Width: 1618px (x: 147px to 1765px), Height: 676px (y: 154px to 830px), radius: 60px, white (`#ffffff`), inner padding: 125px | `width: 1618px; max-width: calc(100% - 48px); padding: 125px; border-radius: 60px; background: #fff; box-shadow: 0 10px 40px rgba(53,6,0,0.06);` | `evidence/footer.png` | **Observed** |
| Content Grid | 1368px width (starts at card padding x=272px). 4 columns: 489px, 216px, 349px, 314px (ratio ≈ 1.56fr .69fr 1.11fr 1fr) | `grid-template-columns: 1.56fr 0.69fr 1.11fr 1fr; gap: 32px;` | `evidence/footer.png` | **Observed** |
| Brand Column | Logo lockup (min 120px), tagline (21px/30px, max-width 300px), 4 social buttons | Tagline: "The quiet intelligence behind your brand" | `evidence/footer.png` | **Observed** |
| Social Buttons | Four 50×50px squares, 1px light border, 10px radius, 7px gap, 20px icons | Maroon icon, peach hover | `evidence/footer.png` | **Observed** |
| Column Titles | 26px Inter SemiBold, 600 weight, color: Deep Maroon. Two bars underneath: 76×3px and 34×3px, 7px apart, ember color | `.footer-title` with `::after` bars | `evidence/footer.png` | **Observed** |
| Footer Links | 20px Inter, 45px line pitch (first link ~93px below title) | `.footer-link` | `evidence/footer.png` | **Observed** |
| Newsletter Input | 314px × 66px, 1px light border, 16px radius, 21px left padding | Warm White background, maroon text | `evidence/footer.png` | **Observed** |
| Split Button | Height: 60px, 16px below input. Left dark segment: ~153px wide; Right accent segment: 60px wide with cream ↗ arrow | `.split-btn`: dark maroon segment + ember segment | `evidence/footer.png` | **Observed** |
| Divider & Bottom Row | 1px line at y=718 (relative y in card ~564px). Copyright left: brand name maroon with ember underline; "All rights reserved." right | `border-top: 1px solid var(--line);` | `evidence/footer.png` | **Observed** |
| Ghost Wordmark | Giant text 'anahum' in Instrument Serif Italic lowercase, peach color, clipped gracefully at page bottom | `font-family: var(--font-voice); color: var(--peach); opacity: 0.85;` | `evidence/footer.png` | **Observed** |
