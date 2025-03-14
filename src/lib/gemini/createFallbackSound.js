'use server';

import fs from 'fs/promises';
import path from 'path';

/**
 * Creates a simple fallback sound file if it doesn't exist
 * This is a one-time setup utility
 */
export async function createFallbackSound() {
  const fallbackDir = path.join(process.cwd(), 'public/sounds/fallback');
  const notFoundPath = path.join(fallbackDir, 'not_found.wav');
  
  try {
    // Check if file already exists
    try {
      await fs.access(notFoundPath);
      console.log('Fallback sound already exists');
      return { success: true, message: 'Fallback sound already exists' };
    } catch (e) {
      // File doesn't exist, continue to create it
    }
    
    // Ensure directory exists
    await fs.mkdir(fallbackDir, { recursive: true });
    
    // Create a minimal WAV file (1 second of silence)
    // This is a very basic WAV file with minimal headers
    const wavHeader = Buffer.from([
      0x52, 0x49, 0x46, 0x46, // "RIFF"
      0x24, 0x00, 0x00, 0x00, // Chunk size (36 + data size)
      0x57, 0x41, 0x56, 0x45, // "WAVE"
      0x66, 0x6d, 0x74, 0x20, // "fmt "
      0x10, 0x00, 0x00, 0x00, // Subchunk1 size (16 bytes)
      0x01, 0x00,             // Audio format (1 = PCM)
      0x01, 0x00,             // Number of channels (1)
      0x44, 0xac, 0x00, 0x00, // Sample rate (44100)
      0x44, 0xac, 0x00, 0x00, // Byte rate (44100)
      0x01, 0x00,             // Block align (1)
      0x08, 0x00,             // Bits per sample (8)
      0x64, 0x61, 0x74, 0x61, // "data"
      0x00, 0x00, 0x00, 0x00  // Subchunk2 size (0 bytes of data)
    ]);
    
    // Create 1 second of silence (44100 samples at 8 bits)
    const silenceData = Buffer.alloc(44100, 128); // 128 is silence for 8-bit unsigned PCM
    
    // Update the chunk sizes in the header
    const dataSize = silenceData.length;
    const fileSize = 36 + dataSize;
    wavHeader.writeUInt32LE(fileSize - 8, 4);  // RIFF chunk size
    wavHeader.writeUInt32LE(dataSize, 40);     // data chunk size
    
    // Combine header and data
    const wavFile = Buffer.concat([wavHeader, silenceData]);
    
    // Write the file
    await fs.writeFile(notFoundPath, wavFile);
    
    console.log(`Created fallback sound at ${notFoundPath}`);
    return { success: true, message: `Created fallback sound at ${notFoundPath}` };
  } catch (error) {
    console.error('Error creating fallback sound:', error);
    return { success: false, error: error.message };
  }
} 