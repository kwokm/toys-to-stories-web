import { ToyData, UserData } from '@/types/types';
import { saveUserDataToLocalStorage } from '@/lib/saveData';
import { saveUserData } from '@/lib/dataService';

// Helper function to get existing user data from localStorage
export function getExistingUserData(): UserData | null {
  if (typeof window === 'undefined') {
    return null; // Return null during server-side rendering
  }

  try {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      console.log('No user data found in localStorage');
      return null;
    }

    const parsedData = JSON.parse(userDataString) as UserData;
    console.log('User data from localStorage:', parsedData);
    return parsedData;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

export async function cleanupUserData(
  userData: UserData,
  setCleaning: React.Dispatch<React.SetStateAction<boolean>>,
  isNewToy: boolean = false
): Promise<any> {
  setCleaning(true);
  console.log('DATA AT START OF CLEANUP');
  console.log(userData);

  // Make sure we have toys and vocab data before proceeding
  if (!userData.toys || userData.toys.length === 0 || !userData.toys[0].vocab) {
    console.error('No toy or vocab data available for cleanup');
    setCleaning(false);
    return Promise.resolve(null);
  }

  // Get the new toy (always the first one in the array for this page)
  const newToy = userData.toys[0];

  return fetch('/api/gemini/get-toy-audio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vocab: JSON.stringify(newToy.vocab || []),
      filePath: 'tmp/file_list.txt',
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const result = JSON.parse(data.toyAudio);
        console.log('RECEIVED AT CLEANUP ', result);

        // Update the new toy with the processed vocab
        const processedToy: ToyData = {
          ...newToy,
          vocab: result,
        };
        console.log('PROCESSED TOY IS ', processedToy);

        let finalUserData: UserData;

        if (isNewToy) {
          // If this is a new toy to add to existing user data
          const existingUserData = getExistingUserData();

          if (existingUserData) {
            // Add the new toy to the existing toys array
            finalUserData = {
              ...existingUserData,
              toys: [...existingUserData.toys, processedToy],
            };
          } else {
            // If no existing user data, create new with just this toy
            finalUserData = { ...userData, toys: [processedToy] };
          }
        } else {
          // Original behavior for new user setup
          finalUserData = { ...userData, toys: [processedToy] };
        }

        // Save the updated user data to both localStorage and cloud storage
        saveUserData(finalUserData);
        console.log('USER DATA SAVED TO LOCALSTORAGE AND CLOUD');

        // Prepare the soundboard with the updated user data
        fetch('/api/soundboard-prep', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userData: finalUserData,
          }),
        });
        console.log('bmp saved');
        setCleaning(false);
        return result;
      }
      // setCleaning(false);
      return null;
    })
    .catch(error => {
      console.log('ERROR AT COMPLETEREADY ', error);
      setCleaning(false);
      throw error; // Re-throw the error so it can be caught by the caller
    });
}
