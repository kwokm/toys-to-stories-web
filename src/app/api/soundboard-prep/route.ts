'use server';

// Creates and uploads initial BMPs for the soundboard

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UserData, ToyData } from '@/types/types';
import { processImageServerSide } from '@/lib/utilityFunctions';
import { put } from '@vercel/blob';
import { saveUserDataToCloud } from '@/lib/dataService';

export async function POST(request: NextRequest) {
  try {
    // Parse the request data
    const requestData = await request.json();
    console.log('REQUEST DATA IS ', requestData);

    // Validate that toys exists and is an array
    if (!requestData.toys || !Array.isArray(requestData.toys)) {
      console.error('requestData.toys is not an array:', requestData.toys);

      // Check if toys might be nested in userData property
      if (requestData.userData && Array.isArray(requestData.userData.toys)) {
        console.log('Found toys in requestData.userData');
        requestData.toys = requestData.userData.toys;
      } else {
        // If no toys found, create an empty array to avoid errors
        console.log('No toys found in request, using empty array');
        requestData.toys = [];
      }
    }

    // Process images sequentially to avoid race conditions
    for (const toy of requestData.toys) {
      // Validate toy object has required properties
      if (!toy || !toy.image || !toy.key) {
        console.error('Invalid toy object:', toy);
        continue; // Skip this toy and move to the next one
      }

      // Process the image to BMP format
      try {
        await processImageServerSide(toy.image, toy.key);

        // Read the processed BMP file
        let bmpPath = `tmp/${toy.key}.bmp`;
        if (process.cwd() === '/var/task') {
          bmpPath = path.join(process.cwd(), '../../tmp', `${toy.key}.bmp`);
        }

        // Check if the file exists before trying to read it
        if (fs.existsSync(bmpPath)) {
          // Upload the BMP file to Vercel Blob
          const blobResult = await put(`${toy.key}.bmp`, fs.readFileSync(bmpPath), {
            access: 'public',
            addRandomSuffix: false
          });

          console.log(`Processed and uploaded ${toy.key}.bmp to ${blobResult.url}`);
        } else {
          console.error(`BMP file not found at ${bmpPath}`);
        }
      } catch (error) {
        console.error(`Error processing toy ${toy.key}:`, error);
      }
    }


    // Read the tmp directory for debugging
    const files = fs.readdirSync('tmp');
    console.log('FILES IN TMP ARE ', files);

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
