#!/usr/bin/env python3
"""
Favicon Generator for TimerFlow
Generates a multi-size favicon.ico from a source PNG image.
"""

from PIL import Image
import sys

def generate_favicon(source_path, output_path="public/favicon.ico"):
    """
    Generate a multi-size favicon.ico file.
    Includes 16x16, 32x32, 48x48, and 64x64 variants.
    """
    try:
        # Open the source image
        img = Image.open(source_path)
        
        # Convert to RGBA if not already
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Define favicon sizes
        sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
        
        # Create resized versions with high-quality resampling
        icons = []
        for size in sizes:
            resized = img.resize(size, Image.Resampling.LANCZOS)
            icons.append(resized)
        
        # Save as multi-size ICO
        icons[0].save(
            output_path,
            format='ICO',
            sizes=[(icon.size[0], icon.size[1]) for icon in icons],
            append_images=icons[1:]
        )
        
        print(f"✅ Successfully generated favicon.ico at: {output_path}")
        print(f"   Sizes included: {', '.join([f'{s[0]}x{s[1]}' for s in sizes])}")
        return True
        
    except Exception as e:
        print(f"❌ Error generating favicon: {e}")
        return False

def generate_additional_pngs(source_path):
    """Generate additional PNG favicons for broader browser support."""
    try:
        img = Image.open(source_path)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Generate 16x16 and 32x32 PNGs
        sizes = {
            'favicon-16x16.png': (16, 16),
            'favicon-32x32.png': (32, 32)
        }
        
        for filename, size in sizes.items():
            resized = img.resize(size, Image.Resampling.LANCZOS)
            output_path = f"public/{filename}"
            resized.save(output_path, 'PNG')
            print(f"✅ Generated: {output_path}")
        
        return True
    except Exception as e:
        print(f"❌ Error generating PNG favicons: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_favicon.py <source_image_path>")
        print("Example: python generate_favicon.py clock_icon.png")
        sys.exit(1)
    
    source_image = sys.argv[1]
    
    print("🎨 TimerFlow Favicon Generator")
    print("=" * 50)
    print(f"Source image: {source_image}")
    print()
    
    # Generate multi-size ICO
    if generate_favicon(source_image):
        # Generate additional PNGs
        generate_additional_pngs(source_image)
        print()
        print("✅ All favicon files generated successfully!")
        print()
        print("📋 Next steps:")
        print("1. Commit the changes: git add public/favicon* index.html")
        print("2. Commit message: 'Updated favicon to TimerFlow icon'")
        print("3. Push to GitHub and deploy to Netlify")
        print("4. Hard refresh your browser (Ctrl+Shift+R) to see the new icon")
    else:
        print("❌ Favicon generation failed")
        sys.exit(1)
