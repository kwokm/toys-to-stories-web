"use server";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager, FileState } = require("@google/generative-ai/server");
const { resumableUpload } = require("./resumableUploadForGoogleAPIs");

export async function identifyToy2(fileUrl, fileSize, displayName, mimeType) {

  const apiKey = process.env.GEMINI_API_KEY; // Please set your API key.

  const object = {
    // Set direct link of the file.
    fileUrl: fileUrl,

    // If you want to use the file path of the local PC, please use filePath
    // filePath: "###",

    // Set URL for uploading with the resumable upload.
    resumableUrl: `https://generativelanguage.googleapis.com/upload/v1beta/files?uploadType=resumable&key=${apiKey}`,

    // Set data size (file size).
    dataSize: fileSize, // Please set the file size.

    // If you want to use your access token, please use this.
    // accessToken: "###",

    // Set metadata.
    metadata: { file: { displayName: displayName, mimeType: mimeType } },
  };
  const uploadResult = await resumableUpload(object).catch((err) =>
    console.log(err)
  );

  // The below script is from https://ai.google.dev/api/files#video
  const fileManager = new GoogleAIFileManager(apiKey);
  let file = await fileManager.getFile(uploadResult.file.name);
  while (file.state === FileState.PROCESSING) {
    process.stdout.write(".");
    // Sleep for 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    // Fetch the file from the API again
    file = await fileManager.getFile(uploadResult.file.name);
  }

  if (file.state === FileState.FAILED) {
    throw new Error("image processing failed.");
  }

  // View the response.
  console.log(
    `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
  );

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
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

  
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: file.mimeType,
              fileUri: fileUri,
            },
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("");
  return result.response.text();
}