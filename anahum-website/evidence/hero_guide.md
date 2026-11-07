<USER_REQUEST>
Agent guide: build the landing page hero
Step-by-step guide for the implementing AI agent · v1 · October 18, 2026 · Replaces section 7.0 of AGENT_BRIEF.md
1. Mission and scope
Build the hero (first screen) of the anahum website so that its composition, geometry and atmosphere match the reference image hero-reference.png, re-skinned to the anahum brand. This guide replaces section 7.0 ('Hero') of AGENT_BRIEF.md. Everything else in that brief (brand system, tokens, rules, pitfalls, QA) still applies. If this guide and the brand rules conflict, the brand rules win, unless the conflict is listed in section 4 with a decision.
In scope: nav row, logo, headline, subcopy, two buttons, the planet-and-terrain scene, five service nodes with connectors, and their motion. Out of scope: the rest of the page.
2. Evidence
• hero-reference.png: 1504×1128. The gray margin is presentation background, not part of the design. The design is the rounded card at x 75 to 1429, y 75 to 1052, which is 1354×977 px. Every coordinate below is in this card space, in stage units (u), origin at the card's top-left corner. Crop first: Image.open(p).crop((75,75,1429,1052)).
• Numbers marked fit or bin were computed by script from the image (circle fit, dot grid, color profile). Numbers marked read were taken from zoomed crops and are good to about ±5u. Re-measure anything you rely on.
Not in the evidence (Unknown or Proposed): any animation or hover state, mobile layout, the source artwork layers (terrain, figure), the fonts used, and the page below the hero.
3. Rules
Label every fact Observed, Inferred, Unknown or Proposed (a design addition not in the evidence). Log Unknowns and decisions in OPEN_QUESTIONS.md.
Do
• Build the scene as separate layers (section 7) so each can be checked and swapped on its own.
• Express every size and position in stage units (calc(N * var(--u))) so the scene scales as one piece.
• Take colors only from tokens (color-mix() of token variables for intermediate tones). No new hex literals outside tokens.css.
• Verify by measuring your own render with Playwright (section 11), never by eye alone.
• Keep terrain and veins as static, build-time-generated SVG so the layout never shifts between loads.
Don't
• Don't embed, crop, paste or auto-trace pixels from the reference into the site. It is someone else's artwork and serves as a visual spec only. Author the SVG yourself from the anchor points in section 6.
• Don't copy its text. Its subtitle contains a typo ('Scalded') and its headline is ungrammatical; neither belongs on the site.
• Don't use the reference's yellow-gold, crimson or its brain icon (section 4).
• Don't use a stock photo of a real person for the figure. Use an original SVG silhouette or a user-supplied asset.
• Don't claim a pixel match. You can claim geometry matches within tolerance, because that is what you measure.
• Don't ship a multi-megabyte background image.
4. Brand reconciliation (decisions)
Aspect
Reference
Brand rule
Default decision (confirm with user)
Palette
Crimson sky, orange glow, yellow-gold rim, wine-black ground
Only maroon, ember, cream, peach (plus the extended tones in the brief); no other hues
Map by role: crimson to maroon/ember mixes, gold rim to peach with a cream edge, ground to maroon/black. See 7.2
Gradient
One continuous crimson > orange > gold ramp
Only maroon to black and ember to peach are listed
The sky ramp needs maroon > ember > peach. Treat it as an extension and ask. Fallback if rejected: flat ember sky with the ember-to-peach rim and a maroon-to-black ground
Headline font
Heavy mixed-case sans
Anton uppercase, one italic serif emphasis word
Anton plus Instrument Serif italic (section 8.3)
Copy
'AI That Builds You Grow' and similar
Brand voice, short and calm
Brand lines (section 8.3)
Node icons
Target, bolt, brain, puzzle, chart
Brains, robots and circuit boards are banned
Keep thin ember line icons; replace the brain with a non-brain glyph; confirm all five
Imagery
Lava-like glowing cracks on dark terrain
Avoid circuit boards
Keep organic, mostly shallow-angle veins; avoid right-angle traces
Logo
Sparkle plus letter-spaced 'AI AGENCY'
Use the original anahum vectors only
anahum lockup, cream version, at least 120px wide
Right pill label
'Log In'
Not specified
'Contact sales' (matches the main brief); confirm whether the site has a login
Frame
Rounded card on a gray margin
Not specified
Gray margin is not built. Hero is a full-width block with a 32u top-aligned radius on the bottom corners only if the user wants an inset card (ask)
Header behavior
This nav sits on the hero
Main brief has a floating pill header
This nav shows at the top; the floating pill header from the main brief appears after the user scrolls past 80% of the hero
5. Scaling model
The reference is a fixed 1354×977 composition. Reproduce it as a stage that scales uniformly.
.hero{container-type:inline-size;position:relative;overflow:hidden;background:var(--hero-ground)}
.hero__stage{--u:min(calc(100cqw / 1354), calc(100svh / 977));
  position:relative;margin-inline:auto;width:calc(1354 * var(--u));height:calc(977 * var(--u))}
.hero{min-height:560px}
• u is limited by the smaller of width and height, so on a 1920×992 screen the stage is about 1374×992 and centered; on a tall tablet the stage is width-limited.
• Background layers (disk, halo, terrain, ground) are positioned against the stage but live in .hero, so they extend past the stage edges to the viewport edges. Terrain and ground must be at least 2× stage width.
• UI layers (headline, buttons, nodes, connectors, figure) are anchored inside the stage. The nav pills are the exception: anchor them to the hero edges (left/right: calc(38 * var(--u))) so they do not float inward on wide screens.
• Text floors: at small u proportional text becomes unreadable. Use max(12px, calc(N * var(--u))) for node subtitles, max(14px, …) for node titles and nav links. Position nodes by their connector x (left: X%; transform: translateX(-50%)) with auto width so a floored font cannot break the layout.
• Compact layout (container width under 1100px) is a Proposed design decision: keep the sky, terrain and figure as the backdrop; hide connectors; show the five nodes as a 2-column grid (1 column under 520px) below the buttons; keep tap targets at least 44px.
• Verify calc(100cqw / 1354) resolves as expected in a real browser before going further (log the computed --u in a test).
6. Geometry (stage units, card space)
Element
x
y
Size
Notes
Nav pill (links)
38
38
296×47
Full pill; four links, about 15px, weight 500, first link at x 61
Logo group
centered on 677
center y 62
about 199 wide
Reference mark is a placeholder
Right pill
1158
38
158×47
Bold label, about 15px
Headline line 1
centered on 677
cap top 155, baseline 208
width about 475
Reference: sans 600 at about 77px, line pitch 86
Headline line 2
centered on 677
baseline 295
width about 335
Second tone (paler)
Subtitle
centered on 677
center y 340
width about 382
About 20px, light weight
Button 1
476
388
193×54
Dark fill
Button 2
685
388
193×54
Light fill; gap 16; group centered on 677
Figure
center x 675
y 578 to 650
about 40×72
Floating human silhouette, arms slightly out
Ridge line
across
y about 658 to 700

Peaks near x 800 and 990; terrain fills to y 977
Planet disk (fit, residual 2px): center (679, −597), radius 1066. Lowest rim point at y 469. The rim crosses the card's left and right edges at y about 224. The visible rim edge is hard (a sharp step from bright inside to dark outside). The disk top lies above the card.
Dot grid (fit): square lattice, pitch about 14u, dot diameter about 2 to 3u, light and semi-transparent, visible across the sky inside the disk including behind the headline. Unknown: whether any dots exist outside the disk (the area left of x 300, y 330 to 500 looks dot-free; zoom to confirm) and whether dot opacity varies.
Nodes (read):
Node
x, y
Size
Connector x
Connector ends at y
Top left
135, 568
187×59
237
700
Top right
1051, 572
181×58
1142
710
Middle left
215, 775
177×58
312
887
Middle right
939, 775
176×58
1034
874
Bottom center
571, 838
211×60
683
965 (card bottom)
Node style: radius about 8u, 1px bright border with an outer glow, dark translucent fill, line icon about 28u at left padding about 14u, title about 15.5u (weight 500), subtitle about 11.5u. Connector: 1px vertical line from the node's bottom edge to a glowing dot (radius about 3u with a soft halo of about 8u) that sits on a vein.
Veins (Observed, approximate): thin glowing polylines on the terrain. A central spine runs from about (677, 665) below the figure to (683, 965), with small zigzag kinks. A long near-horizontal vein runs from the top-left connector end toward the spine at about y 705 to 715; a mirrored one comes from the top-right. Other veins fan toward the lower corners at shallow angles. Exact branch layout is Unknown; section 9 says how to author it.
7. Layers (back to front)
Index 0 is the back. Use position:absolute and aria-hidden='true' for all decorative layers.
Z
Layer
Purpose
0
.hero ground
Outside-disk base color
1
.hero__halo
Soft outer glow just beyond the rim
2
.hero__disk
The planet: radial gradient with a hard rim
3
.hero__dots
Dot lattice, clipped to the disk
4
.hero__horizon
Warm glow behind the figure
5
.hero__terrain
Dark ridge silhouette with texture
6
.hero__veins
Glowing vein paths and junction dots
7
.hero__figure
Floating silhouette
8
.hero__links
Connector lines (SVG)
9
content
Nav, headline, subtitle, buttons, nodes
7.1 Disk, halo, dots and horizon (CSS skeleton)
.hero__disk{position:absolute;width:calc(2132*var(--u));aspect-ratio:1;border-radius:50%;
  left:calc(50% + (679 - 677 - 1066)*var(--u));top:calc((-597 - 1066)*var(--u));
  background:radial-gradient(circle closest-side, /* stops from 7.2 */)}
.hero__halo{width:calc(2240*var(--u));aspect-ratio:1;border-radius:50%;/* same center as the disk */
  background:radial-gradient(circle closest-side,transparent 94%,
    color-mix(in srgb,var(--ember) 30%,transparent) 95.2%,transparent 100%)}
.hero__dots{inset:0;clip-path:circle(calc(1066*var(--u)) at calc(50% + 2*var(--u)) calc(-597*var(--u)));
  background-image:radial-gradient(circle,color-mix(in srgb,var(--cream) 55%,transparent) 0 calc(1.2*var(--u)),transparent calc(1.7*var(--u)));
  background-size:calc(14*var(--u)) calc(14*var(--u))}
.hero__horizon{background:radial-gradient(ellipse calc(560*var(--u)) calc(300*var(--u)) at 50% calc(600*var(--u)),
  color-mix(in srgb,var(--ember) 60%,transparent),transparent 70%)}
The disk is wider than the stage, so position these layers inside .hero__stage but let them overflow; .hero clips them. Check that left places the disk center at stage x 679.
7.2 Glow ramp
t is distance from the disk center divided by 1066, so it equals the gradient's percentage position with closest-side. Reference colors are for verification only. Build the brand version from token mixes.
t
Reference (bin)
Brand build
0.55
#8A0216
color-mix(in srgb, var(--ember) 40%, var(--maroon))
0.70
#B40119
ember 52% over maroon
0.78
#CC0A1B
ember 68% over maroon
0.83
#E3231B
ember 90% over maroon
0.875
#F25A1E
var(--ember)
0.925
#F37220 to #F58C27
ember with 25% peach
0.95
#F7A937
ember with 45% peach
0.975
#F9CF6B
var(--peach) at 75% over ember
0.995
rim
var(--peach), with a 1px cream highlight at the edge
above 1.0
#9F041A fading to #860015
transparent (ground shows through)
The reference brightens slowly from 0.55 to 0.80, quickly from 0.80 to 0.90, then climbs to the rim. Keep that shape (slow, then fast, then a bright edge).
8. Components
8.1 Nav and logo
Two glass pills (links on the left, one CTA on the right) and the logo centered. Pill: full radius, fill rgba(maroon, .40) with backdrop-filter: blur(12px), 1px border cream at 18%, cream text. The reference uses lighter frosted pills; the maroon tint is needed because cream on ember is only 3.5:1 for small text. Links: Inter 500. Logo: the extracted anahum lockup (cream version), at least 120px wide. <nav aria-label='Primary'> with real links; the right pill is a link.
8.2 Buttons
• Primary: maroon fill (a maroon-to-black gradient is allowed), ember text (4.8:1), pill radius, Inter 600 about 15px, soft shadow.
• Secondary: peach fill, maroon text (14.1:1), same shape.
• Hover (Proposed): lift 2px, glow shadow in ember at 35%. Visible focus ring in cream with a 2px maroon offset.
8.3 Headline and copy
<h1 class='hero__title'><span class='l1'>Your work.</span> <span class='l2'>On <em>autopilot</em></span></h1>
Anton, uppercase, tight leading; em in Instrument Serif italic, lowercase. Targets: two lines centered on stage x 677; line 1 width about 475 to 560u; line pitch about 86 to 100u; headline block spans stage y 150 to 300. Anton is narrower than the reference sans, so choose the font size by measuring: render, read the line 1 width with Playwright, adjust until it falls in the target. Line 1 cream; line 2 peach only if the measured contrast against the rendered background is at least 3.0:1, otherwise cream.
Subtitle: 'The quiet intelligence behind your brand.' in Inter Light about 20u, maroon text if measured contrast against the rendered glow is at least 4.5:1 (maroon on ember is 4.8:1), otherwise add a soft maroon scrim behind it at 35% opacity. Buttons: 'Book a call' and 'Our services'.
8.4 Nodes
Five <li> items in a <ul class='hero__nodes'>, each an <a> to the matching section anchor, with the connector as a sibling SVG. Default copy from the brand's service areas (confirm):
Position
Title
Subtitle
Icon direction
Top left
AI content
Ads and social
Image or sparkle
Top right
AI visuals
Product imagery
Aperture or photo
Middle left
Automation
Workflows that run
Bolt (keep)
Middle right
AI agents
Chatbots that work
Chat bubble
Bottom center
Custom AI
Built for your team
Sliders or layers (no brain)
Card: fill rgba(maroon-deep, .70) with backdrop-filter: blur(6px), 1px ember border, ember glow (0 0 12px ember at 35%), title cream, subtitle --muted-dark. The 0.70 fill is chosen so the subtitle stays at 4.5:1 or better over the glow; verify by sampling. Focus and hover: border brightens to peach, glow grows.
9. Terrain, figure and veins (authoring method)
You cannot extract these from the reference, and you must not trace it. Build them procedurally and deterministically.
1. Ask first whether the user will supply terrain artwork. If yes, use it (optimized WebP or AVIF, under 250KB) in layer 5 and skip steps 2 and 3 for the terrain only.
2. Terrain: one SVG, at least 2× stage width. A ridge path (seeded noise, amplitude about 25u, peaks near x 800 and 990, baseline about y 665) filled with a maroon-to-black vertical gradient (an allowed pair). Add roughness with feTurbulence plus a low-strength feDisplacementMap, and 35mm-style grain at low opacity. Use a seeded PRNG so output is identical every build.
3. Veins: generate at build time with a script, not at runtime. Start from the five anchor points (section 6 connector ends) and the central spine. Grow branches as polylines with segment angles mostly within 35 degrees of horizontal, 12 to 40u per segment, 3 to 5 branches per anchor, drifting downward and outward. Stroke ember about 1u, with a duplicate blurred under-stroke for glow. Place a junction dot (r about 2.5u) at branch points and a larger one (r about 3u plus halo) at each connector end.
4. Figure: an original silhouette SVG about 72u tall, centered at x 675, floating about 10u above the ridge's glow; fill in near-black maroon with a faint ember rim light.
5. Connectors: SVG lines from each node's bottom edge down to its anchor, 1px, ember at 80%. Each must end exactly on a junction dot (acceptance check in section 11).
Brand check: veins should read as organic cracks of light, not circuit traces. Avoid right angles and regular grids.
10. Motion (all Proposed; none is in the evidence)
Declare each effect with a data-anim attribute and implement it as a module, as in the main brief. All of it is disabled under prefers-reduced-motion (final state, no movement).
Effect
Spec
Headline reveal
Lines fade up with a blur-to-sharp, about 0.9s, stagger 0.12s, matching the reveal seen on the reference theme's headings
Buttons and nav
Fade in after the headline, 0.5s
Veins
Draw-in with stroke-dashoffset, 1.6s, staggered by branch; then idle
Junction dots
Opacity pulse between 0.6 and 1, 2.4s ease-in-out, offset per dot
Nodes
Fade up with stagger 0.12s after the veins begin; connector lines draw top to bottom
Figure
Float +/- 6u over 5s
Parallax
None. Do not add scroll parallax to the scene
Animate only transform, opacity and stroke-dashoffset. Pause the idle loops when the hero is off-screen (IntersectionObserver). Record in OPEN_QUESTIONS that all timings are defaults, not measured.
11. Build steps and gates
1. Prepare evidence. Crop the card, save hero/ref-card.png, write MEASUREMENTS-hero.md with the numbers from section 6 and any you re-measure. Gate: every number you use is traceable to a row there.
2. Tokens and fonts. Add --hero-ground and any hero-only tokens to tokens.css as token mixes; preload the Anton woff2. Gate: the hex grep from the main brief returns nothing outside tokens.css.
3. Stage and scaling. Section 5. Gate: with Playwright at 1920×992, 1366×768 and 1024×1366, the stage's width and height equal 1354u and 977u for the computed u; no horizontal scrollbar.
4. Sky layers. Disk, halo, dots, horizon. Gate: in a screenshot, find the rim by scanning the stage's center column downward for the largest luminance drop; it must fall at y 469u ±4u. The rim must cross the stage edges at y 224u ±6u. Dots appear only inside the disk, with pitch 14u ±1u.
5. Terrain, figure, veins, connectors. Section 9. Gate: each connector's bottom end is within 2u of a junction dot; the ridge line stays between y 650u and 710u at stage center; terrain reaches both viewport edges at 1920 wide.
6. Nav and logo. Gate: pill rectangles within ±5u of section 6; keyboard focus works; logo at least 120px wide.
7. Headline, subtitle, buttons. Gate: bounding boxes within ±8u (headline) and ±5u (buttons); measured contrast passes the thresholds in 8.3 at the rendered pixel locations (sample the background behind each text box in a screenshot with the text hidden).
8. Nodes. Gate: boxes within ±8u of section 6 at 1920×992 (floors may enlarge them at smaller sizes, but no overlap); node text at least 12px; subtitle contrast at least 4.5:1 measured.
9. Motion. Gate: reduced-motion shows the final state; no layout shift (CLS under 0.02); idle loops stop off-screen.
10. Compact layout. Section 5. Gate: no horizontal scroll at 390 and 768; tap targets at least 44px.
11. Handoff. Update THEMING.md (which tokens control the sky ramp, rim and node glow; how to regenerate veins; how to swap terrain art) and OPEN_QUESTIONS.md.
Report after each step: what you verified (with the measured numbers), what you assumed, what is open.
12. Pitfalls
Pitfall
Prevention
Treating the gray frame as part of the design
Build the card interior only
Matching the reference's colors pixel for pixel
Map by role to tokens; verify the shape of the ramp, not hex values
filter: blur() on huge elements (the disk is 2132u wide)
Use gradients for glows; reserve blur for small elements
Many backdrop-filter layers (2 pills plus 5 nodes)
Blur at most 12px, test on a mid-range device, add -webkit-backdrop-filter for Safari
Moiré in the dot grid at fractional scales
Snap the tile size to whole pixels (CSS round() or a JS-set variable) and check at 1366 and 1920
Node text too small when u shrinks
Font floors, auto-width nodes positioned by connector x
Nav floating inward on wide screens
Anchor pills to hero edges, not stage edges
Layout shift from late fonts or art
Reserve the stage size from CSS; preload Anton; font-display: swap
Runtime-random veins
Generate at build time with a seeded PRNG
Heavy raster background hurting LCP
Prefer CSS and SVG; any raster under 250KB, AVIF or WebP
Contrast loss over the bright rim
Measure from a screenshot; use the scrim or the color swaps in 8.3
100vh on mobile
Use svh
Peach text on ember glow
Peach on ember is 2.9:1 and fails; follow the gates in 8.3
Brain, robot or circuit imagery sneaking in via an icon set
Review every icon against section 4
13. Anti-hallucination protocol
• Quote a number only if it appears in this guide or in your own MEASUREMENTS-hero.md, and say which.
• If a detail is not in the evidence (hover states, mobile, timings, vein layout, fonts), write 'Unknown' or 'Proposed' and list it. Do not present a guess as an observation.
• Never write 'matches the reference' without a stated measurement and its tolerance.
• Never describe the reference's code or artwork pipeline; you have only an image.
• If two instructions conflict, stop and ask rather than choosing silently.
14. Definition of done
• All gates in section 11 pass, with the measured values recorded.
• Palette change means editing tokens.css only; swapping the terrain art or the icons does not touch layout code.
• No hex literal outside tokens.css; no yellow, crimson, brain or circuit imagery; no embedded or traced reference pixels.
• Contrast thresholds in 8.3 and 8.4 hold at the rendered locations.
• Reduced-motion and keyboard paths work; hero LCP is under 2.5 seconds on a throttled mobile profile.
• OPEN_QUESTIONS.md lists every decision in section 4 and every Unknown and Proposed item.
15. Ask the user for
1. Terrain and figure artwork, or permission to build them procedurally.
2. Confirmation of the gradient extension (maroon to ember to peach), or the flat fallback.
3. Confirmation of the five node titles, subtitles and icons, especially the brain replacement.
4. Whether the right pill is 'Contact sales' or 'Log in'.
5. Whether the hero is full-bleed or an inset rounded card.
6. Whether the hero nav should hand off to the floating pill header after scrolling.
7. The logo vectors (from the brand file) and final headline and subtitle copy.
8. A mobile mock-up, or approval of the compact layout in section 5.
Appendix: reference glow profile (verification only)
Median color by t (side regions, text and UI masked out): 0.55 #8A0216; 0.625 #980117; 0.70 #B40119; 0.75 #C7011A; 0.80 #DF1E1B; 0.85 #F1431C; 0.90 #F37220; 0.95 #F7A937; 0.975 to 1.0 #F9CF6B; 1.0 to 1.025 #9F041A; beyond 1.05 #810015. Other samples: ground left #27020A, ground center #850208, primary button fill #5E021B, secondary button fill #857055 over its glow. Do not hard-code any of these.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-18T14:58:19+05:00.

The user has uploaded 1 image(s):
- C:/Users/Hasan_asif64/.gemini/antigravity/brain/ffe35d17-a114-4cd4-a752-53fc81b0a928/.user_uploaded/media_1792317494453_14f8d251.jpg
You can embed this image in an artifact if you need the USER to review it.
</ADDITIONAL_METADATA>