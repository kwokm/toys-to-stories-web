'use server';

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UserData, ToyData } from '@/types/types';
import { processImageServerSide } from '@/lib/utilityFunctions';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    // Parse the request data
    const requestData = await request.json();
    console.log('REQUEST DATA IS ', requestData);

    // Make sure the tmp directory exists
    if (!fs.existsSync('tmp')) {
      fs.mkdirSync('tmp', { recursive: true });
    }

    // Save the original userData to tmp
    await fs.promises.writeFile('tmp/userData.json', JSON.stringify(requestData), 'utf8');

    // Process each toy's image and upload to Vercel Blob
    const updatedToys = [];

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
        const bmpPath = `tmp/${toy.key}.bmp`;

        // Check if the file exists before trying to read it
        if (fs.existsSync(bmpPath)) {
          // Upload the BMP file to Vercel Blob
          const blobResult = await put(`${toy.key}.bmp`, fs.readFileSync(bmpPath), {
            access: 'public',
          });

          // Update the toy with the blob URL
          const updatedToy = {
            ...toy,
            bmpUrl: blobResult.url,
          };

          updatedToys.push(updatedToy);
          console.log(`Processed and uploaded ${toy.key}.bmp to ${blobResult.url}`);
        } else {
          console.error(`BMP file not found at ${bmpPath}`);
          updatedToys.push(toy); // Keep the original toy if processing failed
        }
      } catch (error) {
        console.error(`Error processing toy ${toy.key}:`, error);
        updatedToys.push(toy); // Keep the original toy if processing failed
      }
    }

    // Create updated userData with the processed toys
    const updatedUserData = {
      ...requestData,
      toys: updatedToys,
    };

    // Save the updated userData to tmp file
    const updatedUserDataPath = 'tmp/updatedUserData.json';
    await fs.promises.writeFile(updatedUserDataPath, JSON.stringify(updatedUserData), 'utf8');

    // Upload the updatedUserData to Vercel Blob
    let userDataBlobUrl = null;
    try {
      // Generate a unique filename with timestamp to avoid caching issues
      const timestamp = new Date().getTime();
      const userDataBlobResult = await put(`userData.json`, fs.readFileSync(updatedUserDataPath), {
        access: 'public',
        contentType: 'application/json',
      });
      userDataBlobUrl = userDataBlobResult.url;
      console.log(`Uploaded userData to Blob: ${userDataBlobUrl}`);
    } catch (error) {
      console.error('Error uploading userData to Blob:', error);
    }

    // Read the tmp directory for debugging
    const files = fs.readdirSync('tmp');
    console.log('FILES IN TMP ARE ', files);

    // Return the success response with updated data
    return NextResponse.json({
      success: true,
      userData: updatedUserData,
      toys: updatedToys,
      userDataBlobUrl: userDataBlobUrl,
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
