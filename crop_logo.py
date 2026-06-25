from PIL import Image
import sys

img_path = sys.argv[1]

img = Image.open(img_path).convert("RGBA")
width, height = img.size

min_x = width
min_y = height
max_x = 0
max_y = 0

for y in range(height):
    for x in range(width):
        r, g, b, a = img.getpixel((x, y))
        # Look for clearly visible, non-background pixels
        if a > 50:
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y

if min_x < max_x and min_y < max_y:
    # Add a tiny 2% padding so it doesn't touch the absolute edge
    pad_x = int((max_x - min_x) * 0.02)
    pad_y = int((max_y - min_y) * 0.02)
    
    crop_box = (
        max(0, min_x - pad_x),
        max(0, min_y - pad_y),
        min(width, max_x + pad_x),
        min(height, max_y + pad_y)
    )
    img = img.crop(crop_box)
    
    # Make it square by padding the shorter dimension
    w, h = img.size
    size = max(w, h)
    new_img = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    new_img.paste(img, ((size - w) // 2, (size - h) // 2))
    
    # Resize to standard favicon sizes
    new_img = new_img.resize((256, 256), Image.Resampling.LANCZOS)
    new_img.save(img_path, "PNG")
    print("Cropped tightly and squared.")
else:
    print("Could not find opaque bounds.")
