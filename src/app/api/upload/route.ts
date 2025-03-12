import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename with original extension
    const originalName = file.name;
    const extension = path.extname(originalName);
    const filename = `${uuidv4()}${extension}`;

    // Save to public/toy-photos/bg directory
    const uploadDir = path.join(process.cwd(), 'public', 'toy-photos', 'bg');
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    // Return the path that can be used to access the file
    const publicPath = `/toy-photos/bg/${filename}`;

    return NextResponse.json({
      success: true,
      filepath: publicPath,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
