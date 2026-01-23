'use server';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { identifyToy, chooseVocabulary } from '@/lib/gemini';
import mime from 'mime-types';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, fileName, language } = await request.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }

    // Determine MIME type from fileName or fall back to imageUrl
    const mimeType =
      (fileName && (mime.lookup(fileName) as string)) ||
      (imageUrl && (mime.lookup(imageUrl) as string)) ||
      'image/jpeg';

    let identifyToyResult: string;
    try {
      identifyToyResult = await identifyToy(imageUrl, mimeType);
    } catch (error) {
      console.error('Error identifying toy:', error);
      return NextResponse.json(
        {
          error:
            'Failed to identify toy. The AI service may be unavailable or the image could not be processed.',
        },
        { status: 500 }
      );
    }

    let toyTitle: string;
    try {
      console.log('JSON IS', JSON.parse(identifyToyResult));
      toyTitle = JSON.parse(identifyToyResult).Item;
      if (!toyTitle) {
        throw new Error('No toy title found in identification result');
      }
    } catch (error) {
      console.error('Error parsing identification result:', error);
      return NextResponse.json(
        { error: 'Failed to parse toy identification result. The AI response may be malformed.' },
        { status: 500 }
      );
    }

    let chooseVocabularyResult: string;
    try {
      chooseVocabularyResult = await chooseVocabulary(toyTitle, language);
    } catch (error) {
      console.error('Error choosing vocabulary:', error);
      return NextResponse.json(
        { error: 'Failed to generate vocabulary. The AI service may be unavailable.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      geminiIdentify: identifyToyResult,
      geminiVocabulary: chooseVocabularyResult,
      originalUrl: imageUrl,
    });
  } catch (error) {
    console.error('Unexpected error processing request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
