import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini API with the server-side API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface GeneralGeminiAPIRequest {
    prompt: string;
    settings?: {
        temperature?: number;
        maxOutputTokens?: number;
    };
}

const defaultSettings = {
  temperature: 1,
  maxOutputTokens: 8192,
};

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const body: GeneralGeminiAPIRequest = await request.json();

    const requestSettings = body.settings || defaultSettings;

    // Initialize the model - using gemini-2.0-flash for quick translations
    const geminiModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
        generationConfig: {
            temperature: requestSettings.temperature, // Lower temperature for more deterministic translations
            maxOutputTokens: requestSettings.maxOutputTokens, // Short response is all we need
        },
    });

    // Generate content
    const result = await geminiModel.generateContent(body.prompt);
    const response = await result.response;
    const finalResult = response.text().trim();
    return finalResult;

    // Return the response
    return NextResponse.json({ translation });
  } catch (error: any) {
    console.error('General Gemini API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 