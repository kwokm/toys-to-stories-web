'use server';

import { NextRequest, NextResponse } from 'next/server';
import { updateEdgeConfig } from '@/lib/updateEdgeConfig';

export async function POST(request: NextRequest) {
  try {
    const { key, value } = await request.json();

    // Request from Gemini
    const toyAudio = await updateEdgeConfig(key, value);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error getting toy audio:', error);
    return NextResponse.json({ error: 'Failed to get toy audio' }, { status: 500 });
  }
}
