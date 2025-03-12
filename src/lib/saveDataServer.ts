'use server';

import { ToyData, UserData } from '@/types/types';
import fs from 'fs/promises';
import path from 'path';

/**
 * Save ToyData to a JSON file, appending to existing data if the file exists
 * @param toy ToyData object to save
 * @returns Promise that resolves when the file is saved
 */
export async function saveToyDataToFile(
    toy: ToyData,
  ): Promise<void> {
      // Save to public/toy-photos directory
      let uploadDir = '';
      if (process.cwd() === '/var/task') {
          uploadDir = path.join(process.cwd(), '../../tmp');
      } else {
          uploadDir = path.join(process.cwd(), '/tmp');
      }
      
      const filePath = path.resolve(process.cwd(), uploadDir, 'toysData.json');
      
    try {
      // Check if file exists and read it
      let existingData: { toys: ToyData[] } = { toys: [] };
      
      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        existingData = JSON.parse(fileContent);
      } catch (readError) {
        // File doesn't exist or can't be read, use empty array
        console.log('No existing toys data file found, creating new one');
      }
      
      // Check if toy with same key already exists
      const toyIndex = existingData.toys.findIndex(t => t.key === toy.key);
      
      if (toyIndex >= 0) {
        // Update existing toy
        existingData.toys[toyIndex] = toy;
        console.log(`Updated existing toy with key: ${toy.key}`);
      } else {
        // Add new toy
        existingData.toys.push(toy);
        console.log(`Added new toy with key: ${toy.key}`);
      }
      
      // Write updated data back to file
      const jsonData = JSON.stringify(existingData, null, 2);
      await fs.writeFile(filePath, jsonData, 'utf8');
      console.log(`ToyData successfully saved to ${uploadDir}`);
    } catch (error) {
      console.error('Error saving ToyData to file:', error);
      throw error;
    }
  };

export async function saveUserDataToFile(
  data: UserData,
): Promise<void> {
  try {
    // Save to public/toy-photos directory
    let uploadDir = '';
    if (process.cwd() === '/var/task') {
        uploadDir = path.join(process.cwd(), '../../tmp');
    } else {
    uploadDir = path.join(process.cwd(), '/tmp');
    }
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(path.resolve(process.cwd(), uploadDir, 'userData.json'), jsonData, 'utf8');
    console.log(`UserData successfully saved to ${uploadDir}`);
  } catch (error) {
    console.error('Error saving UserData to file:', error);
    throw error;
  }
};

/**
 * Save multiple ToyData objects to a JSON file, merging with existing data
 * @param newToys Array of ToyData objects to save
 * @param shouldMerge Whether to merge with existing data (default: true)
 * @returns Promise that resolves when the file is saved
 */
export async function saveToysDataToFile(
  newToys: ToyData[],
  shouldMerge: boolean = true
): Promise<void> {
    // Save to public/toy-photos directory
    let uploadDir = '';
    if (process.cwd() === '/var/task') {
        uploadDir = path.join(process.cwd(), '../../tmp');
    } else {
        uploadDir = path.join(process.cwd(), '/tmp');
    }
    
    const filePath = path.resolve(process.cwd(), uploadDir, 'toysData.json');
    
  try {
    let finalToys: ToyData[] = [...newToys];
    
    // If merging is enabled, try to read existing file
    if (shouldMerge) {
      try {
        const existingContent = await fs.readFile(filePath, 'utf8');
        const existingData = JSON.parse(existingContent);
        
        if (existingData && existingData.toys && Array.isArray(existingData.toys)) {
          // Create a map of existing toys by key for quick lookup
          const existingToysMap = new Map(
            (existingData.toys as ToyData[]).map((toy: ToyData) => [toy.key, toy] as [string, ToyData])
          );
          
          // Add new toys, replacing existing ones with the same key
          for (const toy of newToys) {
            existingToysMap.set(toy.key, toy);
          }
          
          // Convert map back to array
          finalToys = Array.from(existingToysMap.values());
          console.log(`Merged ${newToys.length} toys with ${existingData.toys.length} existing toys`);
        }
      } catch (readError) {
        // File doesn't exist or can't be read, use only new toys
        console.log('No existing toys data file found, creating new one');
      }
    }
    
    const jsonData = JSON.stringify({ toys: finalToys }, null, 2);
    await fs.writeFile(filePath, jsonData, 'utf8');
    console.log(`${finalToys.length} ToyData objects successfully saved to ${uploadDir}`);
  } catch (error) {
    console.error('Error saving ToyData array to file:', error);
    throw error;
  }
};