import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
  try {
    // For backward compatibility, we'll redirect to the list endpoint
    // This way, any existing code that uses this endpoint will still work
    return NextResponse.json({
      message: 'Please use the /api/demo-data/list endpoint to get a list of available demo data',
      redirectTo: '/api/demo-data/list',
    });
  } catch (error) {
    console.error('Error in demo-data API route:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please use the /api/demo-data/list endpoint.' },
      { status: 500 }
    );
  }
}
