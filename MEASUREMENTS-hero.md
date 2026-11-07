# Hero Geometry & Measurements Specification (MEASUREMENTS-hero.md)

This document records the exact geometry and measurements for the hero section based on `hero-reference.png` cropped to the card coordinate space (1354×977 px).

All coordinates are in **stage units (u)** where origin `(0, 0)` is at the card's top-left corner.
Formula: `1u = min(100cqw / 1354, 100svh / 977)`.

---

## 1. Canvas & Disk Geometry

| Element | Specification / Measurement | Evidence / Derivation | Status |
|---|---|---|---|
| Card / Stage Size | `1354u × 977u` | `ref-card.png` (x: 75 to 1429, y: 75 to 1052 of 1504×1128 ref) | **Observed** |
| Planet Disk Center | `(679u, -597u)` | Circle fit (residual 2px) | **Fit / Measured** |
| Planet Disk Radius | `1066u` (Diameter `2132u`) | Circle fit | **Fit / Measured** |
| Lowest Rim Point | `y = 469u ± 4u` (measured: `y = 473u`) at `x = 679u` | Radial gradient closest-side rim step | **Observed / Measured** |
| Rim Edge Intersection | `y = 224u ± 6u` (measured: `y = 236u`) at card edges | Circle geometry: `(-597) + sqrt(1066^2 - 679^2) = 226u` | **Fit / Measured** |
| Dot Grid Lattice | Square lattice, pitch `14u`, dot radius `1.2u` to `1.5u` | Clipped to circle `r = 1066u` at center `(679u, -597u)` | **Fit / Measured** |
| Horizon Glow | Ellipse `560u × 300u` at `(677u, 600u)` | Radial ember glow behind figure | **Observed** |
| Ridge Line | Across card, `y = 658u` to `700u`, peaks near `x = 800u` and `990u` | Procedural SVG terrain path | **Observed** |
| Floating Figure | Center `x = 675u`, `y = 578u` to `650u`, size `~40u × 72u` | Floating human silhouette, arms slightly out | **Observed** |

---

## 2. Nav & Header Geometry

| Element | x | y | Width × Height | Notes |
|---|---|---|---|---|
| Nav Links Pill | Left edge: `calc(38 * var(--u))` | `38u` | `296u × 47u` | Frosted pill, 4 links: Home, Services, Work, About Us |
| Brand Logo Group | Centered on `x = 677u` | Center `y = 62u` | Width `~199u`, Height `~38u` | anahum lockup in cream version, min 120px |
| Nav Right Pill | Right edge: `calc(38 * var(--u))` (`x = 1158u`) | `38u` | `158u × 47u` | Frosted pill, 'Contact sales' link |

---

## 3. Typography & Buttons

| Element | Center X | Y Position | Dimensions | Styling / Typography |
|---|---|---|---|---|
| Headline Line 1 | `677u` | Cap top `155u`, Baseline `208u` | Width `~475u` to `560u` | Anton uppercase, cream color, tight leading |
| Headline Line 2 | `677u` | Baseline `295u` | Width `~335u` | Anton uppercase with Instrument Serif italic emphasis word |
| Subtitle | `677u` | Center `y = 340u` | Width `~382u` | Inter Light `~20u`, "The quiet intelligence behind your brand." |
| Primary Button ("Book a call") | `476u` | `388u` | `193u × 54u` | Deep maroon fill, ember text, pill radius |
| Secondary Button ("Our services") | `685u` | `388u` | `193u × 54u` | Peach fill, maroon text, pill radius |
| Button Group Gap | - | - | Gap `16u` | Group centered on `x = 677u` |

---

## 4. Five Service Nodes & Connector Terminals

| Node | Position (x, y) | Card Dimensions | Connector X | Terminal Junction Dot (x, y) | Service Title / Subtitle |
|---|---|---|---|---|---|
| **Top Left** | `(135u, 568u)` | `187u × 59u` | `237u` | `(237u, 700u)` | **AI content** · Ads and social |
| **Top Right** | `(1051u, 572u)` | `181u × 58u` | `1142u` | `(1142u, 710u)` | **AI visuals** · Product imagery |
| **Middle Left** | `(215u, 775u)` | `177u × 58u` | `312u` | `(312u, 887u)` | **Automation** · Workflows that run |
| **Middle Right** | `(939u, 775u)` | `176u × 58u` | `1034u` | `(1034u, 874u)` | **AI agents** · Chatbots that work |
| **Bottom Center** | `(571u, 838u)` | `211u × 60u` | `683u` | `(683u, 965u)` | **Custom AI** · Built for your team |

*All connectors run 1px vertical ember lines from node bottom edge down to exact junction dot (radius ~3u with 8u soft glow) sitting on the terrain vein network.*
