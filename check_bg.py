from PIL import Image
import collections

try:
    img = Image.open('gift_box.png')
    img = img.convert('RGBA')
    width, height = img.size
    
    # Check corners
    corners = [
        img.getpixel((0, 0)),
        img.getpixel((width-1, 0)),
        img.getpixel((0, height-1)),
        img.getpixel((width-1, height-1))
    ]
    
    print(f"Corners: {corners}")
    
    # Check if all corners are the same
    if all(c == corners[0] for c in corners):
        print("Uniform background detected.")
        print(f"Background color: {corners[0]}")
    else:
        print("Non-uniform background.")
        
except Exception as e:
    print(f"Error: {e}")
