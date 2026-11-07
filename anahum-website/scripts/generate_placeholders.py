import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

os.makedirs('public/assets', exist_ok=True)

def create_cinematic_placeholder(filename, width, height, label, style="abstract"):
    # Base gradient: Deep maroon (#350600 = 53, 6, 0) to darker maroon/black (#1b0300 = 27, 3, 0)
    arr = np.zeros((height, width, 3), dtype=np.float32)
    
    # Create radial & linear lighting
    for y in range(height):
        v = y / height
        for x in range(width):
            u = x / width
            # warm ambient light center at (0.6, 0.35)
            dist = np.sqrt((u - 0.6)**2 + (v - 0.35)**2)
            glow = np.exp(-dist * 2.8)
            
            # Maroon base
            r = 35 + 30 * (1 - v) + 120 * glow
            g = 6 + 10 * glow
            b = 0 + 5 * glow
            
            # Subtle amber touch
            if glow > 0.4:
                r += (glow - 0.4) * 80
                g += (glow - 0.4) * 30
                
            arr[y, x] = [min(255, r), min(255, g), min(255, b)]
            
    # Add 35mm film grain
    np.random.seed(42 + len(filename))
    grain = np.random.normal(0, 7.0, (height, width, 3))
    arr = np.clip(arr + grain, 0, 255).astype(np.uint8)
    
    img = Image.fromarray(arr)
    draw = ImageDraw.Draw(img)
    
    # Elegant geometric framing overlay
    draw.rectangle([20, 20, width - 20, height - 20], outline=(255, 250, 238, 25), width=1)
    
    # Save image
    img.save(os.path.join('public/assets', filename), quality=92)
    print(f"Generated {filename} ({width}x{height})")

# Generate all placeholders needed
placeholders = [
    ('hero.jpg', 800, 600, 'anahum — Intelligent Studio'),
    ('what-we-do.jpg', 720, 560, 'anahum — Systems in Motion'),
    ('services-1.jpg', 800, 600, 'AI Workflow Automation'),
    ('services-2.jpg', 800, 600, 'AI Product Visuals'),
    ('services-3.jpg', 800, 600, 'Chatbots & Autonomous Agents'),
    ('services-4.jpg', 800, 600, 'Custom Intelligence Engines'),
    ('work-1.jpg', 700, 480, 'Automated Brand Engine'),
    ('work-2.jpg', 700, 480, 'Synthetic Commerce Studio'),
    ('work-3.jpg', 700, 480, 'Cognitive Dispatch Network'),
    ('work-4.jpg', 700, 480, 'Predictive Analytics Cloud'),
    ('expert-1.jpg', 600, 600, 'Elena Vance — Principal AI Strategist'),
    ('expert-2.jpg', 600, 600, 'Marcus Thorne — Lead Systems Architect'),
    ('thumb-1.jpg', 300, 300, 'Team 1'),
    ('thumb-2.jpg', 300, 300, 'Team 2'),
    ('thumb-3.jpg', 300, 300, 'Team 3'),
    ('thumb-4.jpg', 300, 300, 'Team 4'),
]

for p in placeholders:
    create_cinematic_placeholder(*p)

print("All cinematic placeholders generated successfully.")
