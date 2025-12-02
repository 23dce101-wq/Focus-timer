#!/usr/bin/env python3
"""
Generate TimerFlow Clock Icon and Favicon
Creates a clock icon with gradient background and converts to multi-size favicon.ico
"""

from PIL import Image, ImageDraw
import math

def create_clock_icon(size=512):
    """Create a clock icon with gradient background."""
    # Create image with transparency
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Define colors (cyan/blue gradient like TimerFlow)
    bg_color_start = (22, 189, 202)  # #16BDCA (cyan)
    bg_color_end = (59, 130, 246)    # #3B82F6 (blue)
    
    # Draw rounded rectangle background with gradient
    corner_radius = size // 8
    
    # Simple gradient approximation
    for y in range(size):
        ratio = y / size
        r = int(bg_color_start[0] * (1 - ratio) + bg_color_end[0] * ratio)
        g = int(bg_color_start[1] * (1 - ratio) + bg_color_end[1] * ratio)
        b = int(bg_color_start[2] * (1 - ratio) + bg_color_end[2] * ratio)
        draw.rectangle([(0, y), (size, y+1)], fill=(r, g, b, 255))
    
    # Draw rounded corners mask
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], corner_radius, fill=255)
    
    # Apply mask
    img.putalpha(mask)
    
    # Draw clock
    center_x, center_y = size // 2, size // 2
    clock_radius = size // 3
    
    # Clock circle
    clock_margin = size // 20
    draw.ellipse(
        [(center_x - clock_radius, center_y - clock_radius),
         (center_x + clock_radius, center_y + clock_radius)],
        outline=(255, 255, 255, 255),
        width=size // 40
    )
    
    # Clock hands
    # Hour hand (pointing at 10)
    hour_angle = -60  # degrees
    hour_length = clock_radius * 0.5
    hour_rad = math.radians(hour_angle)
    hour_x = center_x + hour_length * math.sin(hour_rad)
    hour_y = center_y - hour_length * math.cos(hour_rad)
    draw.line([(center_x, center_y), (hour_x, hour_y)], 
              fill=(255, 255, 255, 255), width=size // 50)
    
    # Minute hand (pointing at 2)
    minute_angle = 60  # degrees
    minute_length = clock_radius * 0.7
    minute_rad = math.radians(minute_angle)
    minute_x = center_x + minute_length * math.sin(minute_rad)
    minute_y = center_y - minute_length * math.cos(minute_rad)
    draw.line([(center_x, center_y), (minute_x, minute_y)], 
              fill=(255, 255, 255, 255), width=size // 60)
    
    # Center dot
    dot_radius = size // 30
    draw.ellipse(
        [(center_x - dot_radius, center_y - dot_radius),
         (center_x + dot_radius, center_y + dot_radius)],
        fill=(255, 255, 255, 255)
    )
    
    return img

def generate_favicon_from_icon(icon_img, output_path="public/favicon.ico"):
    """Generate multi-size favicon.ico from icon image."""
    sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    
    icons = []
    for size in sizes:
        resized = icon_img.resize(size, Image.Resampling.LANCZOS)
        icons.append(resized)
    
    # Save as multi-size ICO
    icons[0].save(
        output_path,
        format='ICO',
        sizes=[(icon.size[0], icon.size[1]) for icon in icons],
        append_images=icons[1:]
    )
    
    print(f"✅ Generated favicon.ico at: {output_path}")
    print(f"   Sizes: {', '.join([f'{s[0]}x{s[1]}' for s in sizes])}")

def generate_png_favicons(icon_img):
    """Generate PNG favicon variants."""
    sizes = {
        'favicon-16x16.png': (16, 16),
        'favicon-32x32.png': (32, 32)
    }
    
    for filename, size in sizes.items():
        resized = icon_img.resize(size, Image.Resampling.LANCZOS)
        output_path = f"public/{filename}"
        resized.save(output_path, 'PNG', optimize=True)
        print(f"✅ Generated: {output_path}")

if __name__ == "__main__":
    print("🎨 TimerFlow Favicon Generator")
    print("=" * 50)
    print()
    
    # Create clock icon
    print("Creating TimerFlow clock icon...")
    icon = create_clock_icon(512)
    
    # Save high-res version
    icon.save("public/icon-512x512.png", 'PNG', optimize=True)
    print("✅ Generated: public/icon-512x512.png")
    
    # Generate smaller sizes
    icon_192 = icon.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save("public/icon-192x192.png", 'PNG', optimize=True)
    print("✅ Generated: public/icon-192x192.png")
    
    # Generate favicon files
    print()
    print("Generating favicon files...")
    generate_favicon_from_icon(icon)
    generate_png_favicons(icon)
    
    print()
    print("✅ All favicon files generated successfully!")
    print()
    print("📋 Files created:")
    print("   - public/favicon.ico (16x16, 32x32, 48x48, 64x64)")
    print("   - public/favicon-16x16.png")
    print("   - public/favicon-32x32.png")
    print("   - public/icon-192x192.png")
    print("   - public/icon-512x512.png")
    print()
    print("📋 Next steps:")
    print("1. Review the generated icons")
    print("2. Commit: git add public/* index.html")
    print("3. Commit message: 'Updated favicon to TimerFlow icon'")
    print("4. Push and deploy")
    print("5. Hard refresh browser (Ctrl+Shift+R)")
