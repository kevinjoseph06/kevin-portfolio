from PIL import Image, ImageDraw
import sys

img_path = sys.argv[1]
out_path = sys.argv[2]

# Load tightly cropped logo
logo = Image.open(img_path).convert("RGBA")

# Create a transparent 256x256 base
size = 256
base = Image.new("RGBA", (size, size), (0, 0, 0, 0))

# Draw black rounded rectangle
draw = ImageDraw.Draw(base)
radius = 40 # slightly rounded corners
bg_color = (10, 10, 12, 255) # very dark gray/black #0a0a0c

# Draw rounded rectangle manually for compatibility
draw.rounded_rectangle([(0, 0), (size-1, size-1)], radius=radius, fill=bg_color)

# Resize logo to fit inside with a small margin
# Let's make the logo 85% of the size
logo_size = int(size * 0.85)
logo.thumbnail((logo_size, logo_size), Image.Resampling.LANCZOS)

# Calculate centered position
w, h = logo.size
x = (size - w) // 2
y = (size - h) // 2

# Paste logo using its alpha channel as mask
base.paste(logo, (x, y), logo)

# Save
base.save(out_path, "PNG")
print("Added rounded black background successfully.")
