import os
import subprocess
from PIL import Image
import numpy as np

abs_dir = os.path.abspath('screenshots')
os.makedirs(abs_dir, exist_ok=True)
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

viewports = [
    (1920, 992, '1920x992'),
    (1440, 900, '1440x900'),
    (1024, 768, '1024x768'),
    (768, 1024, '768x1024'),
    (390, 844, '390x844'),
]

print("=== CAPTURING RESPONSIVE VIEWPORTS ===")
for w, h, name in viewports:
    out_file = os.path.join(abs_dir, f'render_{name}.png')
    cmd = [
        chrome_path,
        '--headless=new',
        '--disable-gpu',
        f'--screenshot={out_file}',
        f'--window-size={w},{h}',
        '--virtual-time-budget=1500',
        'http://localhost:4173/'
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_file):
        im = Image.open(out_file)
        print(f"Captured {name}: image size {im.size}, file size {os.path.getsize(out_file)} bytes")
    else:
        print(f"Failed to capture {name}: {res.stderr}")

print("\n=== MEASURING HEADER PILL AT 1920x992 ===")
im1920 = Image.open(os.path.join(abs_dir, 'render_1920x992.png'))
arr = np.array(im1920)

# Check top pill: pill has cream background #FFFAEE (around 255, 250, 238)
# Hero has maroon background #350600 (around 53, 6, 0)
is_pill = (arr[:120, :, 0] > 200) & (arr[:120, :, 1] > 200) & (arr[:120, :, 2] > 200)
ys, xs = np.where(is_pill)
if len(ys) > 0:
    y_min, y_max = ys.min(), ys.max()
    x_min, x_max = xs.min(), xs.max()
    height = y_max - y_min + 1
    width = x_max - x_min + 1
    center_x = (x_min + x_max) / 2
    print(f"Header Pill Top: {y_min}px (Target ~24px)")
    print(f"Header Pill Height: {height}px (Target 60px)")
    print(f"Header Pill Width: {width}px (Target 540-580px)")
    print(f"Header Pill Center X: {center_x}px (Target 960px)")
    print(f"Header Pill Delta from Center: {abs(center_x - 960)}px")

print("\n=== VERIFYING NO HORIZONTAL OVERFLOW ===")
for w, h, name in viewports:
    out_file = os.path.join(abs_dir, f'render_{name}.png')
    im = Image.open(out_file)
    actual_w = im.size[0]
    print(f"Viewport {name}: rendered width = {actual_w}px (Exact match: {actual_w == w})")
