const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction:
    'You are helping parents connect with their children and learn new words. You will receive the title of a toy, and language.  Based primarily on the title, pick 4 vocabulary words that are appropriate for children between the ages of 2 and 5.  Place higher priority on words that can be associated with sound - for instance "Roar", "Neigh", "Gallop", "Munch".  Then translate the words to the given language.  Only return the word and translated word.\n\nExample Words:\nHorse: Neigh, Gallop, Roar, Munch\nDarth Vader: Lightsaber, Breathe, Push, Zoom\nAlligator: Chomp, Swimp, Mud, Snap',
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
      VocabData: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            word: {
              type: 'string',
            },
            translation: {
              type: 'string',
            },
          },
          required: ['word', 'translation'],
        },
      },
    },
    required: ['VocabData'],
  },
};

async function chooseVocabulary(toyTitle, language) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(`Toy Title: ${toyTitle}, Language: ${language}`);
  console.log(result.response.text());
  return result.response.text();
}

export { chooseVocabulary };
