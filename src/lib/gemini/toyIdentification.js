'use server';
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-flash-lite-latest',
  systemInstruction:
    'You are a toy identification system. For each image you see:\n1. Identify the toy in the image\n2. Provide ONLY the most essential name/character in 1-2 words maximum\n3. Do not include descriptions, explanations, or qualifiers\n4. Focus on the main character/toy identity only\n5. Give the toy a creative name\n\nExamples:\n- For a blue dinosaur plush toy → "Dinosaur" or "Blue Dino" for the Item & "Azul" for the name\n- For a LEGO Darth Vader figure → "Sith" for the Item & "Darth Vader" for the name',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  responseSchema: {
    type: 'object',
    properties: {
      Item: {
        type: 'string',
      },
      Name: {
        type: 'string',
      },
    },
    required: ['Item', 'Name'],
  },
};

export async function identifyToy(imageUrl, mimeType = 'image/jpeg') {
  // Fetch the image from URL and convert to base64
  const response = await fetch(imageUrl);
  const imageArrayBuffer = await response.arrayBuffer();
  const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

  // Use generateContent directly with inlineData
  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64ImageData,
            },
          },
        ],
      },
    ],
    generationConfig,
  });

  console.log(result.response.text());
  return result.response.text();
}
