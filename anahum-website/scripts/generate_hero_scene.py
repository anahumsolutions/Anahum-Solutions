import os
import random
import math

def generate_hero_assets():
    os.makedirs('src/partials', exist_ok=True)
    random.seed(20261018)

    # 1. GENERATE TERRAIN SVG (stage width 1354u, 2x width = 2708u)
    # Ridge baseline y=665u, peaks near x=800u and x=990u, range y=650 to 700
    width = 2708
    stage_offset = (width - 1354) / 2 # 677u offset so stage x=0 is at 677px in SVG
    height = 977

    # Generate ridge points from x=0 to x=width
    ridge_points = []
    x_step = 25
    for x in range(0, width + x_step, x_step):
        stage_x = x - stage_offset
        # baseline y around 668
        y = 668.0
        # Peak 1 near stage x=800
        d1 = abs(stage_x - 800) / 140.0
        if d1 < 3.0:
            y -= 22.0 * math.exp(-d1**2)
        # Peak 2 near stage x=990
        d2 = abs(stage_x - 990) / 120.0
        if d2 < 3.0:
            y -= 18.0 * math.exp(-d2**2)
        # Subtle mountain noise
        noise = (random.random() - 0.5) * 8.0
        y += noise
        ridge_points.append((x, y))

    # Build SVG path
    path_d = f"M 0 {ridge_points[0][1]:.1f} "
    for x, y in ridge_points[1:]:
        path_d += f"L {x:.1f} {y:.1f} "
    path_d += f"L {width} {height} L 0 {height} Z"

    terrain_svg = f'''<svg class="hero__terrain-svg" viewBox="0 0 {width} {height}" preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="var(--hero-terrain-top)" />
      <stop offset="35%" stop-color="var(--hero-terrain-top)" stop-opacity="0.95" />
      <stop offset="100%" stop-color="var(--hero-terrain-base)" />
    </linearGradient>
    <filter id="terrainFilter" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="displaced" />
    </filter>
  </defs>
  <path d="{path_d}" fill="url(#terrainGrad)" filter="url(#terrainFilter)" />
</svg>'''

    with open('src/partials/hero-terrain.svg', 'w', encoding='utf-8') as f:
        f.write(terrain_svg)
    print("Generated src/partials/hero-terrain.svg")

    # 2. GENERATE VEINS SVG (in stage coordinates 1354x977)
    # Connector terminal dots:
    terminals = [
        (237, 700),   # Top Left
        (1142, 710),  # Top Right
        (312, 887),   # Middle Left
        (1034, 874),  # Middle Right
        (683, 965)    # Bottom Center
    ]

    # Spine from (677, 665) down to (683, 965)
    spine_points = [
        (677, 665),
        (675, 710),
        (681, 755),
        (678, 805),
        (682, 860),
        (679, 915),
        (683, 965)
    ]

    vein_paths = []
    # 1. Central spine path
    spine_d = f"M {spine_points[0][0]} {spine_points[0][1]} "
    for px, py in spine_points[1:]:
        spine_d += f"L {px} {py} "
    vein_paths.append(spine_d)

    # 2. Top-left connector branch into spine at y ~ 710
    tl_d = "M 237 700 L 320 706 L 430 709 L 550 712 L 675 710"
    vein_paths.append(tl_d)

    # 3. Top-right connector branch into spine at y ~ 715
    tr_d = "M 1142 710 L 1040 714 L 920 716 L 800 713 L 675 710"
    vein_paths.append(tr_d)

    # 4. Middle-left connector into spine at y ~ 860
    ml_d = "M 312 887 L 410 878 L 520 869 L 682 860"
    vein_paths.append(ml_d)

    # 5. Middle-right connector into spine at y ~ 860
    mr_d = "M 1034 874 L 930 870 L 810 864 L 682 860"
    vein_paths.append(mr_d)

    # 6. Additional organic veins drifting toward lower corners at shallow angles
    vein_paths.append("M 237 700 L 180 735 L 120 780 L 60 840 L 0 910")
    vein_paths.append("M 1142 710 L 1210 745 L 1270 790 L 1320 845 L 1354 890")
    vein_paths.append("M 312 887 L 240 915 L 150 945 L 80 977")
    vein_paths.append("M 1034 874 L 1110 905 L 1200 940 L 1280 977")
    vein_paths.append("M 682 860 L 610 900 L 520 945 L 470 977")
    vein_paths.append("M 682 860 L 750 900 L 840 945 L 890 977")

    junction_dots = [
        (320, 706), (550, 712), (1040, 714), (800, 713),
        (410, 878), (930, 870), (180, 735), (1210, 745),
        (675, 710), (682, 860), (610, 900), (750, 900)
    ]

    # Assemble Veins SVG
    veins_svg = f'''<svg class="hero__veins-svg" viewBox="0 0 1354 977" aria-hidden="true">
  <defs>
    <!-- Soft Glow Filter for Veins -->
    <filter id="veinGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Glowing Under-Strokes -->
  <g stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.35" filter="url(#veinGlow)" fill="none">
'''
    for path in vein_paths:
        veins_svg += f'    <path d="{path}" class="vein-path" />\n'
    veins_svg += '''  </g>

  <!-- Crisp Core Veins -->
  <g stroke="var(--accent)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" fill="none">
'''
    for path in vein_paths:
        veins_svg += f'    <path d="{path}" class="vein-path-core" />\n'
    veins_svg += '  </g>\n\n  <!-- Branch Junction Dots (r=2.5) -->\n  <g fill="var(--accent)" opacity="0.9">\n'
    for jx, jy in junction_dots:
        veins_svg += f'    <circle cx="{jx}" cy="{jy}" r="2.5" class="junction-dot" />\n'
    veins_svg += '  </g>\n\n  <!-- Terminal Connector Dots (r=3 with r=8 soft glow) -->\n  <g class="terminal-dots">\n'
    for tx, ty in terminals:
        veins_svg += f'    <circle cx="{tx}" cy="{ty}" r="8" fill="var(--accent)" opacity="0.35" filter="url(#veinGlow)" />\n'
        veins_svg += f'    <circle cx="{tx}" cy="{ty}" r="3" fill="var(--cream)" />\n'
    veins_svg += '  </g>\n</svg>'

    with open('src/partials/hero-veins.svg', 'w', encoding='utf-8') as f:
        f.write(veins_svg)
    print("Generated src/partials/hero-veins.svg")

    # 3. GENERATE FIGURE SVG (~40u x 72u, centered at x=675, y=578 to 650)
    figure_svg = '''<svg class="hero__figure-svg" viewBox="0 0 40 72" width="40" height="72" aria-hidden="true">
  <defs>
    <filter id="figureRim" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="var(--accent)" flood-opacity="0.6" />
    </filter>
  </defs>
  <!-- Human silhouette floating with arms slightly out -->
  <g filter="url(#figureRim)" fill="color-mix(in srgb, var(--maroon) 25%, black)">
    <!-- Head -->
    <circle cx="20" cy="8" r="6" />
    <!-- Neck -->
    <rect x="18" y="14" width="4" height="4" />
    <!-- Torso -->
    <path d="M 12 18 L 28 18 L 26 42 L 14 42 Z" />
    <!-- Left Arm slightly out -->
    <path d="M 12 19 L 4 34 L 6 36 L 13 24 Z" />
    <!-- Right Arm slightly out -->
    <path d="M 28 19 L 36 34 L 34 36 L 27 24 Z" />
    <!-- Left Leg floating -->
    <path d="M 14 42 L 13 62 L 11 72 L 15 72 L 18 62 L 19 42 Z" />
    <!-- Right Leg floating -->
    <path d="M 26 42 L 27 62 L 29 72 L 25 72 L 22 62 L 21 42 Z" />
  </g>
</svg>'''

    with open('src/partials/hero-figure.svg', 'w', encoding='utf-8') as f:
        f.write(figure_svg)
    print("Generated src/partials/hero-figure.svg")

    # 4. GENERATE CONNECTORS SVG (1354x977)
    # Exact vertical lines from node bottom edges to connector terminals:
    connectors = [
        (237, 627, 700),   # Top Left: y=568+59=627 down to 700
        (1142, 630, 710),  # Top Right: y=572+58=630 down to 710
        (312, 833, 887),   # Middle Left: y=775+58=833 down to 887
        (1034, 833, 874),  # Middle Right: y=775+58=833 down to 874
        (683, 898, 965)    # Bottom Center: y=838+60=898 down to 965
    ]

    connectors_svg = '''<svg class="hero__links-svg" viewBox="0 0 1354 977" aria-hidden="true">
  <g stroke="var(--accent)" stroke-width="1" stroke-dasharray="2 3" opacity="0.85">
'''
    for cx, y1, y2 in connectors:
        connectors_svg += f'    <line x1="{cx}" y1="{y1}" x2="{cx}" y2="{y2}" class="connector-line" />\n'
    connectors_svg += '  </g>\n</svg>'

    with open('src/partials/hero-links.svg', 'w', encoding='utf-8') as f:
        f.write(connectors_svg)
    print("Generated src/partials/hero-links.svg")

if __name__ == '__main__':
    generate_hero_assets()
