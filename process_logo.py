from PIL import Image
import sys

img_path = sys.argv[1]
out_path = sys.argv[2]

img = Image.open(img_path).convert("RGBA")
datas = img.getdata()

newData = []
for item in datas:
    # If pixel is near white, make transparent
    if item[0] > 230 and item[1] > 230 and item[2] > 230:
        newData.append((255, 255, 255, 0))
    else:
        # Anti-aliasing edge smoothing
        # If it's grayish-white (near the edge of the blue)
        intensity = (item[0] + item[1] + item[2]) / 3
        if intensity > 200 and abs(item[0]-item[1]) < 20 and abs(item[1]-item[2]) < 20:
            alpha = int(255 - (intensity - 200) * 4.6)
            newData.append((item[0], item[1], item[2], max(0, alpha)))
        else:
            newData.append(item)

img.putdata(newData)

# Find bounding box of non-transparent pixels to crop tight
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# Resize to something reasonable
img.thumbnail((256, 256), Image.Resampling.LANCZOS)
img.save(out_path, "PNG")
