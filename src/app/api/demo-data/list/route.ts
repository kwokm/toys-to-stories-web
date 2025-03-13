import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
  try {
    // List all blobs with the prefix "userdata"
    const userDataBlobs = await list({ prefix: 'userData' });

    // List all blobs with the prefix "stories"
    const storiesBlobs = await list({ prefix: 'stories' });

    // Return the lists of blobs
    return NextResponse.json({
      userDataBlobs: userDataBlobs.blobs,
      storiesBlobs: storiesBlobs.blobs,
      message: 'Demo data list fetched successfully',
    });
  } catch (error) {
    console.error('Error listing demo data blobs:', error);
    return NextResponse.json(
      {
        error:
          'Failed to list demo data blobs. Make sure Vercel Blob storage is properly configured.',
      },
      { status: 500 }
    );
  }
}
