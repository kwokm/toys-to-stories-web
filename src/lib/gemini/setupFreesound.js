'use server';

import { createFallbackSound } from './createFallbackSound';
import fs from 'fs/promises';
import path from 'path';

/**
 * Sets up the necessary directories and files for Freesound integration
 */
export async function setupFreesound() {
  try {
    // Create cache directory
    const cacheDir = path.join(process.cwd(), 'public/sounds/cache');
    await fs.mkdir(cacheDir, { recursive: true });
    
    // Create fallback sound
    const fallbackResult = await createFallbackSound();
    
    // Create a .env.local file if it doesn't exist
    const envPath = path.join(process.cwd(), '.env.local');
    let envExists = false;
    
    try {
      await fs.access(envPath);
      envExists = true;
    } catch (e) {
      // File doesn't exist
    }
    
    if (!envExists) {
      await fs.writeFile(
        envPath,
        `# Freesound API Key - Get one at https://freesound.org/apiv2/apply/
FREESOUND_API_KEY=your_api_key_here
`
      );
    } else {
      // Check if FREESOUND_API_KEY is already in the file
      const envContent = await fs.readFile(envPath, 'utf8');
      if (!envContent.includes('FREESOUND_API_KEY')) {
        await fs.appendFile(
          envPath,
          `\n# Freesound API Key - Get one at https://freesound.org/apiv2/apply/
FREESOUND_API_KEY=your_api_key_here
`
        );
      }
    }
    
    return {
      success: true,
      message: 'Freesound integration setup complete',
      details: {
        cacheDir,
        fallback: fallbackResult,
        envFile: envPath
      }
    };
  } catch (error) {
    console.error('Error setting up Freesound integration:', error);
    return {
      success: false,
      error: error.message
    };
  }
} 