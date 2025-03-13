import { NextRequest, NextResponse } from 'next/server';
import { storyCreationMultipleToys } from '@/lib/gemini/storyCreationMutipleToys';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = await storyCreationMultipleToys(prompt);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error in create-story API route:', error);
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}
