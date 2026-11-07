import os
from PIL import Image
import numpy as np

def verify_hero_measurements():
    img_path = 'screenshots/render_1920x992.png'
    assert os.path.exists(img_path), f"Missing {img_path}"
    
    im = Image.open(img_path)
    w, h = im.size
    print(f"Loaded screenshot {img_path}: size = {w}x{h}")
    arr = np.array(im)
    
    # 1. Scaling stage check:
    # 1920x992 viewport:
    # cqw = 1920, svh = 992
    # 100cqw / 1354 = 1.4179
    # 100svh / 977 = 1.01535
    # Therefore u is height-limited: u = 992 / 977 = 1.01535 px
    # stage width = 1354 * 1.01535 = 1374.8 px
    # stage height = 977 * 1.01535 = 992 px
    # stage left offset = (1920 - 1374.8) / 2 = 272.6 px
    u = 992.0 / 977.0
    stage_x0 = (1920.0 - 1354.0 * u) / 2.0
    print(f"Computed u at 1920x992: {u:.4f}px. Stage offset X0: {stage_x0:.1f}px")
    
    # 2. Gate 4: Sky Rim detection at center column
    # Center of stage is stage_x0 + 679 * u:
    center_x = int(round(stage_x0 + 679 * u))
    print(f"Stage Center column in viewport: x={center_x} (Expected ~960px)")
    
    col = arr[:, center_x, :3].astype(float)
    # Luminance formula: 0.299R + 0.587G + 0.114B
    lum = 0.299 * col[:, 0] + 0.587 * col[:, 1] + 0.114 * col[:, 2]
    
    # Scan from y=400u to 520u (in viewport pixels: 400*u to 520*u)
    y_start = int(400 * u)
    y_end = int(520 * u)
    diffs = lum[y_start:y_end-1] - lum[y_start+1:y_end]
    peak_y_idx = np.argmax(diffs) + y_start
    peak_y_u = peak_y_idx / u
    print(f"Detected lowest rim point at center: y={peak_y_u:.1f}u ({peak_y_idx}px). Target: 469u +/- 4u")
    
    # Check left edge of stage (x = int(stage_x0 + 10))
    left_x = int(round(stage_x0 + 10))
    col_left = arr[:, left_x, :3].astype(float)
    lum_left = 0.299 * col_left[:, 0] + 0.587 * col_left[:, 1] + 0.114 * col_left[:, 2]
    y_l_start = int(180 * u)
    y_l_end = int(260 * u)
    diffs_left = lum_left[y_l_start:y_l_end-1] - lum_left[y_l_start+1:y_l_end]
    peak_left_idx = np.argmax(diffs_left) + y_l_start
    peak_left_u = peak_left_idx / u
    print(f"Detected rim intersection near stage left edge: y={peak_left_u:.1f}u ({peak_left_idx}px). Target: 224u +/- 6u")
    
    # 3. Gate 5: Ridge line & Terrain coverage
    # Terrain must reach both viewport edges at 1920 wide
    # Left edge x=0 and right edge x=1919 should have terrain colors (dark maroon/black) in lower third
    terrain_left_sample = arr[int(800*u), 5, :3]
    terrain_right_sample = arr[int(800*u), 1914, :3]
    print(f"Terrain sample left edge: RGB {terrain_left_sample.tolist()}")
    print(f"Terrain sample right edge: RGB {terrain_right_sample.tolist()}")
    
    # 4. Gate 7: Headline & Buttons contrast check
    # Sample background color in headline region (y ~ 200*u, center)
    bg_headline = arr[int(220*u), center_x, :3]
    print(f"Background at headline region: RGB {bg_headline.tolist()}")
    
    # Cream text is #FFFAEE (255, 250, 238)
    # Calculate relative luminance
    def rel_lum(rgb):
        srgb = [c / 255.0 for c in rgb]
        lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
        return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
        
    def contrast_ratio(rgb1, rgb2):
        l1 = rel_lum(rgb1)
        l2 = rel_lum(rgb2)
        hi = max(l1, l2)
        lo = min(l1, l2)
        return (hi + 0.05) / (lo + 0.05)
        
    cream_rgb = [255, 250, 238]
    headline_contrast = contrast_ratio(cream_rgb, bg_headline)
    print(f"Headline text contrast over background: {headline_contrast:.2f}:1 (Target >= 3.0:1)")
    
    # 5. Check Node 1 (Top Left) card area
    node1_x = int(round(stage_x0 + 135 * u))
    node1_y = int(round(568 * u))
    node1_sample = arr[node1_y + 20, node1_x + 30, :3]
    print(f"Node 1 card interior sample: RGB {node1_sample.tolist()}")
    node_contrast = contrast_ratio(cream_rgb, node1_sample)
    print(f"Node 1 text contrast over card fill: {node_contrast:.2f}:1 (Target >= 4.5:1)")

if __name__ == '__main__':
    verify_hero_measurements()
