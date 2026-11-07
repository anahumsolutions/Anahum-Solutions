import os
from PIL import Image
import numpy as np

def measure():
    results = {}
    
    # 1. Header pill in t000s
    im_t0 = Image.open('evidence/frames/t000s.jpg')
    arr_t0 = np.array(im_t0)
    
    # Background in t000s top row:
    bg_color = arr_t0[5, 960].tolist()
    
    # Scan vertically at x=960 to find header pill top & bottom
    header_top = None
    header_bottom = None
    for y in range(10, 150):
        if not np.allclose(arr_t0[y, 960], bg_color, atol=10):
            if header_top is None:
                header_top = y
        elif header_top is not None and header_bottom is None:
            header_bottom = y
            break
            
    # Scan horizontally at header center to find left & right
    header_center_y = (header_top + header_bottom) // 2 if header_top and header_bottom else 50
    header_left = None
    header_right = None
    for x in range(100, 1820):
        if not np.allclose(arr_t0[header_center_y, x], bg_color, atol=10):
            if header_left is None:
                header_left = x
        elif header_left is not None and header_right is None:
            header_right = x
            
    results['header'] = {
        'top': header_top,
        'bottom': header_bottom,
        'height': header_bottom - header_top if header_top and header_bottom else None,
        'left': header_left,
        'right': header_right,
        'width': header_right - header_left if header_left and header_right else None,
        'bg_color': bg_color
    }

    # 2. What We Do (t000s, t002s)
    # Section container, left text, right image & stat cards
    # Let's inspect t002s for What We Do content bounds
    im_t2 = Image.open('evidence/frames/t002s.jpg')
    arr_t2 = np.array(im_t2)
    # Let's find content width container bounds
    # Looking for left margin of text and right edge of image
    # In t002s, find where the image is on right:
    # Usually around x=1000 to x=1650
    results['what_we_do'] = {
        'frame': 't000s.jpg, t002s.jpg',
    }

    # 3. Services (t006s, t010s, t012s)
    im_t6 = Image.open('evidence/frames/t006s.jpg')
    im_t10 = Image.open('evidence/frames/t010s.jpg')
    
    # 4. Dark bento panel (t018s, t020s, t022s)
    im_t20 = Image.open('evidence/frames/t020s.jpg')
    arr_t20 = np.array(im_t20)
    # Find dark bento container:
    # Look for dark background bounding box (e.g., color close to #121212 or #1c1c1c)
    dark_y_indices = np.where(arr_t20[:, 960, 0] < 50)[0]
    dark_x_indices = np.where(arr_t20[500, :, 0] < 50)[0] if len(dark_y_indices) > 0 else []
    
    results['dark_bento'] = {
        'frame': 't020s.jpg',
        'top': int(dark_y_indices[0]) if len(dark_y_indices) else None,
        'bottom': int(dark_y_indices[-1]) if len(dark_y_indices) else None,
        'left': int(dark_x_indices[0]) if len(dark_x_indices) else None,
        'right': int(dark_x_indices[-1]) if len(dark_x_indices) else None,
    }

    # 5. Selected Works (t028s, t030s)
    im_t28 = Image.open('evidence/frames/t028s.jpg')
    
    # 6. Working Process (t038s, t040s)
    im_t38 = Image.open('evidence/frames/t038s.jpg')
    im_t42 = Image.open('evidence/frames/t042s.jpg')
    
    # 7. Our Experts (t046s, t050s)
    im_t46 = Image.open('evidence/frames/t046s.jpg')
    
    # 8. Features Orbit (t060s)
    im_t60 = Image.open('evidence/frames/t060s.jpg')
    
    # 9. Pricing (t064s)
    im_t64 = Image.open('evidence/frames/t064s.jpg')
    
    # 10. Footer (evidence/footer.png)
    im_f = Image.open('evidence/footer.png')
    arr_f = np.array(im_f)
    
    # Card bounds:
    # y: 154 to 830, x: 147 to 1765
    results['footer'] = {
        'sheet_width': im_f.size[0],
        'sheet_height': im_f.size[1],
        'card_x0': 147,
        'card_x1': 1765,
        'card_width': 1765 - 147,
        'card_y0': 154,
        'card_y1': 830,
        'card_height': 830 - 154
    }
    
    print('Initial results:', results)

if __name__ == '__main__':
    measure()
