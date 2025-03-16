import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserData, ToyData } from '@/types/types';
import { saveUserData as saveUserDataToStorage, getUserData as getUserDataFromStorage } from './dataService';

// Initial state
const initialUserData: UserData = {
  language: null,
  readingLevel: null,
  toys: [],
};

// Define the store type
interface UserDataStore {
  userData: UserData;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  setUserData: (userData: UserData) => void;
  updateLanguage: (language: string | null) => void;
  updateReadingLevel: (level: number | null) => void;
  updateToys: (toys: ToyData[]) => void;
  updateToy: (index: number, toy: ToyData) => void;
  initialize: () => Promise<void>;
}

// Create the store
export const useUserDataStore = create<UserDataStore>()(
  persist(
    (set, get) => ({
      userData: initialUserData,
      isLoading: false,
      isInitialized: false,
      
      setUserData: (userData) => {
        set({ userData });
        saveUserDataToStorage(userData);
      },
      
      updateLanguage: (language) => {
        const newUserData = { ...get().userData, language };
        set({ userData: newUserData });
        saveUserDataToStorage(newUserData);
      },
      
      updateReadingLevel: (readingLevel) => {
        const newUserData = { ...get().userData, readingLevel };
        set({ userData: newUserData });
        saveUserDataToStorage(newUserData);
      },
      
      updateToys: (toys) => {
        const newUserData = { ...get().userData, toys };
        set({ userData: newUserData });
        saveUserDataToStorage(newUserData);
      },
      
      updateToy: (index, toy) => {
        const toys = [...get().userData.toys];
        toys[index] = toy;
        const newUserData = { ...get().userData, toys };
        set({ userData: newUserData });
        saveUserDataToStorage(newUserData);
      },
      
      initialize: async () => {
        set({ isLoading: true });
        
        // Try to get data from localStorage first
        const storedData = getUserDataFromStorage();
        
        if (storedData) {
          set({ 
            userData: storedData,
            isInitialized: true,
            isLoading: false
          });
        } else {
          // If no local data, use initial state
          set({ 
            userData: initialUserData,
            isInitialized: true,
            isLoading: false
          });
        }
      },
    }),
    {
      name: 'user-data-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Hook for initializing the store
export function useInitializeUserData() {
  const { initialize, isInitialized } = useUserDataStore();
  
  if (!isInitialized) {
    initialize();
  }
  
  return { isInitialized };
} 