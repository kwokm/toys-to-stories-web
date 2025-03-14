'use server';

import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const FREESOUND_API_KEY = process.env.FREESOUND_API_KEY;
const SOUND_CACHE_DIR = path.join(process.cwd(), 'public/sounds/cache');

/**
 * Fetches audio files from Freesound API based on vocabulary words
 * 
 * @param {string} input - JSON string containing vocab array with words to find audio for
 * @returns {string} - JSON string with vocab array including audio file paths
 */
export async function getToyAudioFreesound(input) {
  // Parse the input JSON
  const inputData = typeof input === 'string' ? JSON.parse(input) : input;
  const results = [];
  
  // Ensure cache directory exists
  try {
    await fs.mkdir(SOUND_CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating cache directory:', error);
  }
  
  // Process each vocabulary word
  for (const item of inputData.vocab) {
    const word = item.word;
    const sanitizedWord = word.replace(/\W+/g, '_').toLowerCase();
    const cachedFilePath = path.join(SOUND_CACHE_DIR, `${sanitizedWord}.wav`);
    const publicPath = `/sounds/cache/${sanitizedWord}.wav`;
    
    // Check if we already have this sound cached
    try {
      await fs.access(cachedFilePath);
      // File exists, use cached version
      results.push({
        ...item,
        audio: publicPath
      });
      console.log(`Using cached sound for "${word}": ${publicPath}`);
      continue;
    } catch (e) {
      // File doesn't exist, need to fetch it
      console.log(`No cached sound for "${word}", fetching from Freesound...`);
    }
    
    try {
      // Search Freesound for the word
      const searchResponse = await axios.get(`https://freesound.org/apiv2/search/text/`, {
        params: {
          query: word,
          fields: 'id,name,previews',
          filter: 'duration:[0 TO 3]', // Sounds up to 3 seconds
          sort: 'score',
          token: FREESOUND_API_KEY
        }
      });
      
      if (searchResponse.data.results && searchResponse.data.results.length > 0) {
        const bestMatch = searchResponse.data.results[0];
        
        // Get the preview URL (preferring WAV if available, falling back to MP3)
        const previewUrl = bestMatch.previews['preview-hq-wav'] || 
                          bestMatch.previews['preview-hq-mp3'] || 
                          bestMatch.previews['preview-lq-mp3'];
        
        if (previewUrl) {
          // Download the sound
          const soundResponse = await axios.get(previewUrl, { 
            responseType: 'arraybuffer',
            headers: {
              Authorization: `Token ${FREESOUND_API_KEY}`
            }
          });
          
          await fs.writeFile(cachedFilePath, Buffer.from(soundResponse.data));
          
          results.push({
            ...item,
            audio: publicPath,
            source: 'freesound',
            soundId: bestMatch.id,
            soundName: bestMatch.name
          });
          
          console.log(`Downloaded sound for "${word}": ${publicPath}`);
        } else {
          throw new Error('No preview URL available');
        }
      } else {
        // No results found, try a more generic search
        const genericSearchResponse = await axios.get(`https://freesound.org/apiv2/search/text/`, {
          params: {
            query: word.split(' ')[0], // Use just the first word for broader results
            fields: 'id,name,previews',
            filter: 'duration:[0 TO 3]',
            sort: 'score',
            token: FREESOUND_API_KEY
          }
        });
        
        if (genericSearchResponse.data.results && genericSearchResponse.data.results.length > 0) {
          const fallbackMatch = genericSearchResponse.data.results[0];
          const fallbackUrl = fallbackMatch.previews['preview-hq-wav'] || 
                             fallbackMatch.previews['preview-hq-mp3'] || 
                             fallbackMatch.previews['preview-lq-mp3'];
          
          if (fallbackUrl) {
            const soundResponse = await axios.get(fallbackUrl, { 
              responseType: 'arraybuffer',
              headers: {
                Authorization: `Token ${FREESOUND_API_KEY}`
              }
            });
            
            await fs.writeFile(cachedFilePath, Buffer.from(soundResponse.data));
            
            results.push({
              ...item,
              audio: publicPath,
              source: 'freesound-fallback',
              soundId: fallbackMatch.id,
              soundName: fallbackMatch.name
            });
            
            console.log(`Downloaded fallback sound for "${word}": ${publicPath}`);
          } else {
            throw new Error('No fallback preview URL available');
          }
        } else {
          throw new Error('No sounds found');
        }
      }
    } catch (error) {
      console.error(`Error fetching sound for "${word}":`, error.message);
      
      // Use a fallback sound
      results.push({
        ...item,
        audio: '/sounds/fallback/not_found.wav',
        error: error.message
      });
    }
  }
  
  return JSON.stringify({ vocab: results });
}

/**
 * Helper function to get a single sound from Freesound
 * Can be used independently or as a fallback
 */
export async function getSingleFreesoundAudio(word) {
  const sanitizedWord = word.replace(/\W+/g, '_').toLowerCase();
  const cachedFilePath = path.join(SOUND_CACHE_DIR, `${sanitizedWord}.wav`);
  const publicPath = `/sounds/cache/${sanitizedWord}.wav`;
  
  // Check cache first
  try {
    await fs.access(cachedFilePath);
    return publicPath;
  } catch (e) {
    // Not cached, continue to API
  }
  
  try {
    // Ensure cache directory exists
    await fs.mkdir(SOUND_CACHE_DIR, { recursive: true });
    
    // Search Freesound
    const searchResponse = await axios.get(`https://freesound.org/apiv2/search/text/`, {
      params: {
        query: word,
        fields: 'id,name,previews',
        filter: 'duration:[0 TO 3]',
        sort: 'score',
        token: FREESOUND_API_KEY
      }
    });
    
    if (searchResponse.data.results && searchResponse.data.results.length > 0) {
      const bestMatch = searchResponse.data.results[0];
      const previewUrl = bestMatch.previews['preview-hq-wav'] || 
                        bestMatch.previews['preview-hq-mp3'] || 
                        bestMatch.previews['preview-lq-mp3'];
      
      if (previewUrl) {
        const soundResponse = await axios.get(previewUrl, { 
          responseType: 'arraybuffer',
          headers: {
            Authorization: `Token ${FREESOUND_API_KEY}`
          }
        });
        
        await fs.writeFile(cachedFilePath, Buffer.from(soundResponse.data));
        return publicPath;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error in getSingleFreesoundAudio for "${word}":`, error.message);
    return null;
  }
} 