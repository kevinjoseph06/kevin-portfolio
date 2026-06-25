from PIL import Image
import sys

img_path = sys.argv[1]
out_path = sys.argv[2]

img = Image.open(img_path).convert("RGBA")
datas = img.getdata()

newData = []
# Distance from center
w, h = img.size
cx, cy = w/2, h/2
radius = min(w, h)/2 * 0.98 # slight margin

for y in range(h):
    for x in range(w):
        dx = x - cx
        dy = y - cy
        dist_sq = dx*dx + dy*dy
        
        pixel = img.getpixel((x, y))
        
        # If it's a white background pixel (R,G,B > 240) and it's near the edge
        if pixel[0] > 240 and pixel[1] > 240 and pixel[2] > 240 and dist_sq > (radius * 0.9)**2:
            newData.append((255, 255, 255, 0))
        elif dist_sq > radius**2 and pixel[0] > 200 and pixel[1] > 200 and pixel[2] > 200:
             newData.append((255, 255, 255, 0))
        else:
            # Let's just do a basic flood-fill style check: if it's pure white, transparent
            if pixel[0] > 245 and pixel[1] > 245 and pixel[2] > 245:
                # Anti-aliasing might leave a thin white edge, but for a 32x32 favicon it's fine.
                newData.append((255, 255, 255, 0))
            else:
                newData.append(pixel)

img.putdata(newData)

# Resize for favicon
img = img.resize((256, 256), Image.Resampling.LANCZOS)
img.save(out_path, "PNG")
