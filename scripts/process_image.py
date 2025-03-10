#!/usr/bin/env python
"""
Image processing script for creating PIL-compatible bitmaps.
This script takes an input image, processes it, and saves it as a 1-bit BMP file
that is compatible with PIL's ImageDraw.bitmap() method.

Usage:
    python process_image.py <input_path> <output_path>
"""

import sys
import os
from PIL import Image, ImageOps

def process_image(input_path, output_path):
    """
    Process an image to create a PIL-compatible bitmap.
    
    Args:
        input_path (str): Path to the input image
        output_path (str): Path to save the output BMP file
    """
    try:
        # Open the image
        image = Image.open(input_path)
        
        # Resize to a square (120x120)
        square_size = 120
        
        # Calculate new dimensions while preserving aspect ratio
        width, height = image.size
        aspect_ratio = width / height
        
        if width > height:
            new_width = square_size
            new_height = int(square_size / aspect_ratio)
        else:
            new_height = square_size
            new_width = int(square_size * aspect_ratio)
        
        # Resize the image
        image = image.resize((new_width, new_height), Image.LANCZOS)
        
        # Create a new white background image
        background = Image.new('RGB', (square_size, square_size), (255, 255, 255))
        
        # Calculate position to paste the resized image
        x_offset = (square_size - new_width) // 2
        y_offset = (square_size - new_height) // 2
        
        # Paste the resized image onto the background
        background.paste(image, (x_offset, y_offset))
        
        # Convert to grayscale
        grayscale = ImageOps.grayscale(background)
        
        # Convert to 1-bit bitmap (mode "1") using thresholding
        # This creates a binary image where pixels are either 0 (black) or 1 (white)
        # In PIL's ImageDraw.bitmap(), non-zero portions will be filled with the current fill color
        bitmap = grayscale.point(lambda x: 0 if x < 128 else 1, '1')
        
        # Save as BMP
        bitmap.save(output_path, 'BMP')
        
        print(f"Image processed and saved to {output_path}")
        return True
    except Exception as e:
        print(f"Error processing image: {e}", file=sys.stderr)
        return False

def main():
    """Main function to handle command line arguments."""
    if len(sys.argv) != 3:
        print("Usage: python process_image.py <input_path> <output_path>", file=sys.stderr)
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    success = process_image(input_path, output_path)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 