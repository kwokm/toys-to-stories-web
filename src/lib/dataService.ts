import { UserData, Story, ToyData } from '@/types/types';

// Storage keys
const STORAGE_KEYS = {
  USER_DATA: 'userData',
  STORIES: 'stories',
  SELECTED_TOYS: 'selectedToys',
  CURRENT_STORY_ID: 'currentStoryId',
};

/**
 * Get user data from localStorage
 */
export function getUserData(): UserData | null {
  if (typeof window === 'undefined') {
    return null; // Return null during server-side rendering
  }

  try {
    const userDataString = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!userDataString) {
      return null;
    }

    return JSON.parse(userDataString) as UserData;
  } catch (error) {
    console.error('Error reading user data from localStorage:', error);
    return null;
  }
}

/**
 * Save user data to localStorage
 */
export function saveUserData(userData: UserData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
}

/**
 * Get stories from localStorage
 */
export function getStories(): Story[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storiesString = localStorage.getItem(STORAGE_KEYS.STORIES);
    if (!storiesString) {
      return [];
    }

    return JSON.parse(storiesString) as Story[];
  } catch (error) {
    console.error('Error reading stories from localStorage:', error);
    return [];
  }
}

/**
 * Save stories to localStorage
 */
export function saveStories(stories: Story[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
  } catch (error) {
    console.error('Error saving stories to localStorage:', error);
  }
}

/**
 * Get selected toys from localStorage
 */
export function getSelectedToys(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const selectedToysString = localStorage.getItem(STORAGE_KEYS.SELECTED_TOYS);
    if (!selectedToysString) {
      return [];
    }

    return JSON.parse(selectedToysString) as string[];
  } catch (error) {
    console.error('Error reading selected toys from localStorage:', error);
    return [];
  }
}

/**
 * Save selected toys to localStorage
 */
export function saveSelectedToys(selectedToys: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_TOYS, JSON.stringify(selectedToys));
  } catch (error) {
    console.error('Error saving selected toys to localStorage:', error);
  }
}

/**
 * Get current story ID from localStorage
 */
export function getCurrentStoryId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STORY_ID);
  } catch (error) {
    console.error('Error reading current story ID from localStorage:', error);
    return null;
  }
}

/**
 * Save current story ID to localStorage
 */
export function saveCurrentStoryId(storyId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STORY_ID, storyId);
  } catch (error) {
    console.error('Error saving current story ID to localStorage:', error);
  }
}

/**
 * Check if user has any stories
 */
export function hasStories(): boolean {
  const stories = getStories();
  return stories.length > 0;
}

/**
 * Reset all data in localStorage
 */
export function resetAllData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.STORIES);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_TOYS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STORY_ID);
  } catch (error) {
    console.error('Error resetting data in localStorage:', error);
  }
} 