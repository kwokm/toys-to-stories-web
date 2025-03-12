import { ToyData, UserData } from '@/types/types';

/**
 * Save ToyData to localStorage (for client-side usage)
 * @param data The ToyData object to save
 * @param key The localStorage key to use (default: 'toyData')
 */
export async function saveToyDataToLocalStorage(
  data: ToyData,
  key: string = 'toyData'
): Promise<void> {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`ToyData successfully saved to localStorage with key: ${key}`);
  } catch (error) {
    console.error('Error saving ToyData to localStorage:', error);
    throw error;
  }
};

/**
 * Save UserData to localStorage (for client-side usage)
 * @param data The UserData object to save
 * @param key The localStorage key to use (default: 'userData')
 */
export async function saveUserDataToLocalStorage(
  data: UserData,
  key: string = 'userData'
): Promise<void> {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`UserData successfully saved to localStorage with key: ${key}`);
  } catch (error) {
    console.error('Error saving UserData to localStorage:', error);
    throw error;
  }
};