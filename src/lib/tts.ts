'use server';

import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Get the correct types from the protos
const { AudioEncoding, SsmlVoiceGender } = protos.google.cloud.texttospeech.v1;

// Initialize the TextToSpeechClient
const client = new TextToSpeechClient();

// Path to cache directory for audio files
const AUDIO_CACHE_DIR = path.join(process.cwd(), 'public/audio/pronunciations');

interface TtsOptions {
  languageCode?: string;
  voiceName?: string;
  ssmlGender?: protos.google.cloud.texttospeech.v1.SsmlVoiceGender;
  audioEncoding?: protos.google.cloud.texttospeech.v1.AudioEncoding;
}

/**
 * Generates a pronunciation audio file for a given word
 * @param text - The text to convert to speech
 * @param options - Configuration options
 * @returns The public URL path to the audio file
 */
export async function generatePronunciation(text: string, options: TtsOptions = {}): Promise<string> {
  const {
    languageCode = 'en-US',
    voiceName = 'en-US-Neural2-F',
    ssmlGender = SsmlVoiceGender.FEMALE,
    audioEncoding = AudioEncoding.MP3,
  } = options;

  // Create a unique filename based on the text and voice
  const hash = crypto
    .createHash('md5')
    .update(`${text}-${languageCode}-${voiceName}`)
    .digest('hex');
  
  const fileName = `${hash}.mp3`;
  const filePath = path.join(AUDIO_CACHE_DIR, fileName);
  const publicPath = `/audio/pronunciations/${fileName}`;

  // Check if file already exists in cache
  try {
    await fs.access(filePath);
    console.log(`Using cached pronunciation for "${text}": ${publicPath}`);
    return publicPath;
  } catch (e) {
    // File doesn't exist, need to generate it
    console.log(`No cached pronunciation for "${text}", generating new one...`);
  }

  try {
    // Ensure cache directory exists
    await fs.mkdir(AUDIO_CACHE_DIR, { recursive: true });

    // Construct the request
    const request = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
        ssmlGender,
      },
      audioConfig: {
        audioEncoding,
      },
    };

    // Make the request
    const [response] = await client.synthesizeSpeech(request);
    
    // Write the audio content to a file
    if (response.audioContent) {
      // audioContent is a Uint8Array, write it directly
      await fs.writeFile(filePath, response.audioContent);
      console.log(`Generated pronunciation for "${text}": ${publicPath}`);
      return publicPath;
    } else {
      throw new Error('No audio content returned from TTS API');
    }
  } catch (error) {
    console.error(`Error generating pronunciation for "${text}":`, error);
    throw error;
  }
}

/**
 * Batch generates pronunciations for an array of words
 * @param words - Array of words to generate pronunciations for
 * @param options - Configuration options
 * @returns Object mapping words to their audio URLs
 */
export async function batchGeneratePronunciations(
  words: string[], 
  options: TtsOptions = {}
): Promise<Record<string, string | null>> {
  const results: Record<string, string | null> = {};
  
  // Process words in parallel with Promise.all
  await Promise.all(
    words.map(async (word) => {
      try {
        const url = await generatePronunciation(word, options);
        results[word] = url;
      } catch (error) {
        console.error(`Failed to generate pronunciation for "${word}":`, error);
        results[word] = null;
      }
    })
  );
  
  return results;
} 