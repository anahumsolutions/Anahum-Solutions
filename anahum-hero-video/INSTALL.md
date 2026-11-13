# Video hero: install in 5 steps

Folder layout matches your repo, so copy each file to the same path.

## 1. Add the media

Copy the 3 files in `public/hero/` to your repo's `public/hero/` folder:

- `hero-lava.webm` (1.1 MB)
- `hero-lava.mp4` (1.1 MB)
- `hero-poster.jpg` (179 KB)

The video has no audio and is 9 seconds, with the loop seam already blended so it repeats smoothly.

## 2. Replace the hero markup

Replace `src/partials/hero.html` with the new one.
The coded planet, terrain, veins, figure and connector layers are removed.
Headline, buttons, nav and the 5 service cards are unchanged.

## 3. Add the CSS

Paste `src/css/hero-video.css` at the end of `src/css/sections.css`
(or load it as its own file after `sections.css`).

Optional cleanup in `sections.css`: delete the now-unused rules
`.hero__halo`, `.hero__disk`, `.hero__dots`, `.hero__horizon`,
`.hero__terrain`, `.hero__veins`, `.hero__figure`, `.hero__links`.

## 4. Add the script

Copy `src/js/anim/hero-video.js`, then call it once where you already
call `initHeroEntrance()` (for example in `src/js/main.js`):

```js
import { initHeroVideo } from './anim/hero-video.js'

initHeroVideo()
```

`initHeroEntrance()` needs no changes. It already skips layers that no longer exist.

## 5. Optional cleanup

You can delete these files, which nothing uses anymore:
`src/partials/hero-terrain.svg`, `hero-veins.svg`, `hero-figure.svg`, `hero-links.svg`.

## Tuning

- **Text too dim or too bright over the sun:** change the two `62%` / `72%` values in `.hero__scrim`.
- **Mountain cropped on some screens:** change `object-position: 50% 78%` (higher number shows more of the bottom).
- **Everything else (colours):** comes from `tokens.css`, no colour literals added.

## What the script does

- Fades the video in over the poster once it is playing
- Pauses when the hero is off-screen
- Shows only the still poster for visitors with reduced-motion or Data Saver
- If autoplay is blocked (for example iOS Low Power Mode), the poster stays visible
