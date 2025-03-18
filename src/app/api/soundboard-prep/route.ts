'use server';

// Creates and uploads initial BMPs for the soundboard

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { UserData, ToyData } from '@/types/types';
import { Jimp, ResizeStrategy } from 'jimp';
import Replicate from 'replicate';
import { writeFile } from 'node:fs/promises';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    // Parse the request data
    const requestData = await request.json();
    const toys = requestData.userData.toys;
    console.log('REQUEST DATA IS ', requestData);

    // Validate that toys exists and is an array
    if (!requestData.userData.toys) {
      console.error('requestData.toys is not an array:', requestData.userData.toys);
      return NextResponse.json({
        error: 'Failed to process user data',
        message: 'No toys found in request',
      },
        { status: 500 }
      );
    }

    // Process images sequentially to avoid race conditions
    for (const toy of toys) {
      // Validate toy object has required properties
      if (!toy || !toy.image || !toy.key) {
        console.error('Invalid toy object:', toy);
        continue; // Skip this toy and move to the next one
      }

      // Process the image to BMP format
      try {
        await processImageServerSide(toy.image, toy.key);
      } catch (error) {
        console.error(`Error processing toy ${toy.key}:`, error);
      }
    }

    // Return the success response with updated data
    return NextResponse.json({
      success: true
    });
  } catch (error: any) {
    console.error('Error processing user data:', error);
    return NextResponse.json(
      {
        error: 'Failed to process user data',
        message: error.message,
      },
      { status: 500 }
    );
  }
}




async function removeBackground(
  inputPath: string,
  outputPath: string,
  outputFileName: string
): Promise<void> {
  const replicate = new Replicate();

  const input = {
    image: inputPath,
  };

  const output = await replicate.run(
    '851-labs/background-remover:a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc',
    { input }
  );

  await writeFile('tmp/' + outputFileName + '.png', output as Buffer);
  //=> output written to disk
}

const squareSize = 120;

async function processImageServerSide(inputURL: string, outputFileName: string) {
  const replicate = new Replicate();

  const input = {
    image: inputURL,
  };

  const output = await replicate.run(
    '851-labs/background-remover:a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc',
    { input }
  );

  try {
    const image = await Jimp.read(output as Buffer);
    const originalWidth = image.bitmap.width;
    const originalHeight = image.bitmap.height;
    const aspectRatio = originalWidth / originalHeight;

    let newWidth: number;
    let newHeight: number;
    if (originalWidth > originalHeight) {
      newWidth = squareSize;
      newHeight = squareSize / aspectRatio;
    } else {
      newHeight = squareSize;
      newWidth = squareSize * aspectRatio;
    }

    image.resize({ w: newWidth, h: newHeight, mode: ResizeStrategy.BILINEAR });

    const canvas = new Jimp({
      width: squareSize,
      height: squareSize,
    });
    const xOffset = (squareSize - newWidth) / 2;
    const yOffset = (squareSize - newHeight) / 2;

    canvas.composite(image, xOffset, yOffset);
    canvas.threshold({ max: 128 });
    
    // Get the buffer directly from the canvas
    const buffer = await canvas.getBuffer('image/bmp');
    
    // Upload directly to Vercel Blobs
    const blobResult = await put(`${outputFileName}.bmp`, buffer, {
      access: 'public',
      addRandomSuffix: false
    });
    
    console.log(`Image processed and uploaded to ${blobResult.url}`);
    return blobResult.url;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

async function processBMP(toyData: ToyData) {
  processImageServerSide(toyData.image, toyData.key);
}
