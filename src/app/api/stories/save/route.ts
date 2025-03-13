import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    // Parse the request data
    const { stories, userId = 'anonymous' } = await request.json();

    if (!stories || !Array.isArray(stories)) {
      return NextResponse.json(
        { error: 'Stories data is required and must be an array' },
        { status: 400 }
      );
    }

    // Generate a unique filename with timestamp and userId
    const timestamp = new Date().getTime();
    const filename = `stories-${userId}-${timestamp}.json`;

    // Upload the stories to Vercel Blob
    const storiesBlob = await put(filename, JSON.stringify(stories), {
      access: 'public',
      contentType: 'application/json',
    });

    // Return success response with the blob URL
    return NextResponse.json({
      success: true,
      url: storiesBlob.url,
      message: 'Stories saved to cloud storage successfully',
    });
  } catch (error: any) {
    console.error('Error saving stories to Vercel Blob:', error);
    return NextResponse.json(
      {
        error: 'Failed to save stories to cloud storage',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
