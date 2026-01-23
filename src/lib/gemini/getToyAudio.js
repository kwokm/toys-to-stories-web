// Mark this file as server-only to prevent it from being bundled for the client
'use server';

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const FILE_LIST_URL = 'https://ucarecdn.com/ab747895-9bcc-47a3-bde2-dd427e13ab5a/file_list.txt';

const model = genAI.getGenerativeModel({
  model: 'gemini-flash-latest',
  systemInstruction:
    'AUDIO MATCHING GUIDELINES:\n1. Be LITERAL first - match "dog" with "Animal-Dog-Bark.wav" before metaphorical matches\n2. For animal sounds, match the specific animal when available (e.g., "lion" → files with "Cat-Spotted-Leopard" as the closest big cat)\n3. For actions/verbs:\n   - Match "laugh" → "Human-Laugh-Evil-Rich-Jerk.wav" or "Cartoon-Human-Giant-Laugh.wav"\n   - Match "splash" → "small-water-splash.wav" or "medium-water-splash.wav"\n   - Match "growl" → any animal growl file if the specific animal isn\'t available\n4. For technology/sci-fi words, use "Science-Fiction-" files\n5. For nature/weather words, use appropriate environment sounds\n6. For musical instruments, match with available instrument sounds\n7. When no direct match exists, choose the conceptually closest sound:\n   - "sleep" → "Human-Female-Snoring.wav"\n   - "fast" → "motorcycle-revs.wav"\n   - "magic" → "Science-Fiction-Sci-Fi-Electronic-Personal-Force-Field.wav"\n\nReturn ONLY the exact filename that exists in the list. Do not modify other fields. Your response must be valid JSON.',
});

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  responseSchema: {
    type: 'object',
    properties: {
      vocab: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            translation: {
              type: 'string',
            },
            word: {
              type: 'string',
            },
            audio: {
              type: 'string',
            },
          },
          required: ['audio'],
        },
      },
    },
  },
};

export async function getToyAudio(input) {
  // Fetch the file list from URL and convert to base64
  const response = await fetch(FILE_LIST_URL);
  const textArrayBuffer = await response.arrayBuffer();
  const base64TextData = Buffer.from(textArrayBuffer).toString('base64');

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'text/plain',
              data: base64TextData,
            },
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(input);
  console.log('HELLO THE RESULT IS ', result.response.text());
  return result.response.text();
}
