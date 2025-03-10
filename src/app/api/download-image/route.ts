import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, fileName } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to download image: ${response.statusText}` },
        { status: 500 }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Create a unique filename or use the provided one
    const extension = path.extname(fileName || 'image.jpg');
    const filename = `${uuidv4()}${extension}`;
    
    // Save to public/toy-photos directory
    const uploadDir = path.join(process.cwd(), 'public', 'toy-photos', 'bg');
    const filepath = path.join(uploadDir, filename);
    
    await writeFile(filepath, buffer);
    
    // Return the path that can be used to access the file
    const publicPath = `${path.join(process.cwd(), 'public', 'toy-photos', 'bg')}/${filename}`;
    console.log(publicPath);
    
    return NextResponse.json({ 
      success: true, 
      filepath: publicPath,
      originalUrl: imageUrl
    });
  } catch (error) {
    console.error('Error downloading and saving image:', error);
    return NextResponse.json(
      { error: 'Failed to download and save image' },
      { status: 500 }
    );
  }
} 