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
        const bmpUrl = await processImageServerSide(toy.image, toy.key);
        console.log(`Processed and uploaded ${toy.key}.bmp to ${bmpUrl}`);
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
