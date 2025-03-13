import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    // Parse the request data
    const { userData, userId = 'anonymous' } = await request.json();

    if (!userData) {
      return NextResponse.json(
        { error: 'User data is required' },
        { status: 400 }
      );
    }

    // Generate a unique filename with timestamp and userId
    const timestamp = new Date().getTime();
    const filename = `userData-${userId}-${timestamp}.json`;

    // Upload the user data to Vercel Blob
    const userDataBlob = await put(filename, JSON.stringify(userData), {
      access: 'public',
      contentType: 'application/json',
    });

    // Return success response with the blob URL
    return NextResponse.json({
      success: true,
      url: userDataBlob.url,
      message: 'User data saved to cloud storage successfully',
    });
  } catch (error: any) {
    console.error('Error saving user data to Vercel Blob:', error);
    return NextResponse.json(
      {
        error: 'Failed to save user data to cloud storage',
        message: error.message,
      },
      { status: 500 }
    );
  }
} 