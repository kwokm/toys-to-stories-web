import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini API with the server-side API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { word, targetLanguage } = body;

    if (!word || !targetLanguage) {
      return NextResponse.json(
        { error: 'Word and target language are required' },
        { status: 400 }
      );
    }

    // Create the translation prompt
    const prompt = `Translate this word "${word}" to ${targetLanguage}. Provide ONLY the translated word without any explanation or formatting, just one single word as the translation.`;

    // Initialize the model - using gemini-2.0-flash for quick translations
    const geminiModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.2, // Lower temperature for more deterministic translations
        maxOutputTokens: 50, // Short response is all we need
      },
    });

    // Generate content
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const translation = response.text().trim();

    // Return the response
    return NextResponse.json({ translation });
  } catch (error: any) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing your translation request' },
      { status: 500 }
    );
  }
} 