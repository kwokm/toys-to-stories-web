import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { userDataUrl, storiesUrl } = await request.json();

    if (!userDataUrl || !storiesUrl) {
      return NextResponse.json(
        { error: 'Both userDataUrl and storiesUrl are required' },
        { status: 400 }
      );
    }

    // Fetch the content of the specified blobs
    const [userDataResponse, storiesResponse] = await Promise.all([
      fetch(userDataUrl),
      fetch(storiesUrl),
    ]);

    if (!userDataResponse.ok || !storiesResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch demo data from Vercel Blobs' },
        { status: 500 }
      );
    }

    // Parse the blob content
    const userData = await userDataResponse.json();
    const stories = await storiesResponse.json();

    // Return the demo data
    return NextResponse.json({
      userData,
      stories,
      message: 'Demo data fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching specific demo data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo data. Please try again.' },
      { status: 500 }
    );
  }
}
