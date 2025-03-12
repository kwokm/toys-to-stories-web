'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getToyAudio } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { vocab, filePath } = await request.json();

    // Request from Gemini
    const toyAudio = await getToyAudio(vocab, filePath);

    return NextResponse.json({
      success: true,
      toyAudio: toyAudio,
    });
  } catch (error) {
    console.error('Error getting toy audio:', error);
    return NextResponse.json({ error: 'Failed to get toy audio' }, { status: 500 });
  }
}
