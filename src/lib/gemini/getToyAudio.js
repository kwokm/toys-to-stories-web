// Mark this file as server-only to prevent it from being bundled for the client
'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const { GoogleAIFileManager } = require('@google/generative-ai/server');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

/**
 * Waits for the given files to be active.
 *
 * Some files uploaded to the Gemini API need to be processed before they can
 * be used as prompt inputs. The status can be seen by querying the file's
 * "state" field.
 *
 * This implementation uses a simple blocking polling loop. Production code
 * should probably employ a more sophisticated approach.
 */
async function waitForFilesActive(files) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".")
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name)
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "You are helping us create an AI powered soundboard for language learning.  This is the final part of a multi-prompt chain.  You'll receive a message in this format:\n\n'\n\"vocab\":[\n{\n\"translation\": \"{translated-word}\",\n\"word\": \"{word to find audio for}\"\n},\n...\n]\n'\n\nFor each \"word\", find the most appropriate .wav file in the attached \"file_list.txt\".  Please return the exact path in \"audio\". Do not modify other fields",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      vocab: {
        type: "array",
        items: {
          type: "object",
          properties: {
            translation: {
              type: "string"
            },
            word: {
              type: "string"
            },
            audio: {
              type: "string"
            }
          },
          required: [
            "audio"
          ]
        }
      }
    }
  },
};


export async function getToyAudio(input, fileListPath) {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [await uploadToGemini(fileListPath || 'file_list.txt', 'text/plain')];

  // Some files have a processing delay. Wait for them to be ready.
  await waitForFilesActive(files);

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(input);
  console.log("HELLO THE RESULT IS ", result.response.text());
  return result.response.text();
}
