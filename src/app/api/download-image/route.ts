'use server';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { identifyToy, chooseVocabulary } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, fileName } = await request.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
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

    // Save to tmp directory
    let uploadDir = '';
    if (process.cwd() === '/var/task') {
      uploadDir = path.join(process.cwd(), '../../tmp');
    } else {
      uploadDir = path.join(process.cwd(), '/tmp');
    }
    const filepath = path.join(uploadDir, filename);

    // get file_list from public
    let fileListPath = '';
    if (process.cwd() === '/var/task') {
      fileListPath = path.join(process.cwd(), '../../file_list.txt');
    } else {
      fileListPath = path.join(process.cwd(), '/file_list.txt');
    }

    await writeFile(filepath, buffer);

    // Return the path that can be used to access the file
    const publicPath = `${uploadDir}/${filename}`;
    const identifyToyResult = await identifyToy(`${publicPath}`, `image/${extension}`);
    console.log("JSON IS", JSON.parse(identifyToyResult));
    const toyTitle = JSON.parse(identifyToyResult).Item;
    const language = JSON.parse(identifyToyResult).language;
    const chooseVocabularyResult = await chooseVocabulary(toyTitle, "Spanish");

    return NextResponse.json({
      success: true,
      filepath: publicPath,
      geminiIdentify: identifyToyResult,
      geminiVocabulary: chooseVocabularyResult,
      originalUrl: imageUrl,
    });
  } catch (error) {
    console.error('Error downloading and saving image:', error);
    return NextResponse.json({ error: 'Failed to download and save image' }, { status: 500 });
  }
}
