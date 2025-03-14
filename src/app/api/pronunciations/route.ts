import { NextRequest, NextResponse } from 'next/server';
import { batchGeneratePronunciations } from '@/lib/tts';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { toys, options = {} } = await request.json();
    
    if (!toys || !Array.isArray(toys)) {
      return NextResponse.json(
        { error: 'Invalid request. Expected "toys" to be an array of strings.' },
        { status: 400 }
      );
    }
    
    // Extract just the text from toys if they're objects
    const words = toys.map(toy => typeof toy === 'string' ? toy : toy.name || toy.word);
    
    // Generate pronunciations for all words
    const pronunciationUrls: Record<string, string | null> = await batchGeneratePronunciations(words, options);
    
    // Map the results back to the original toys structure
    const results = toys.map((toy) => {
      const word = typeof toy === 'string' ? toy : toy.name || toy.word;
      return {
        ...(typeof toy === 'string' ? { word: toy } : toy),
        pronunciation: pronunciationUrls[word]
      };
    });
    
    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error generating pronunciations:', error);
    return NextResponse.json(
      { error: 'Failed to generate pronunciations' },
      { status: 500 }
    );
  }
} 