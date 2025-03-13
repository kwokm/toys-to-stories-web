import { ToyData, UserData } from '@/types/types';
import { saveUserDataToLocalStorage } from '@/lib/saveData';

export async function cleanupUserData(
  userData: UserData, 
  setCleaning: React.Dispatch<React.SetStateAction<boolean>>
): Promise<any> {
  setCleaning(true);
  console.log("DATA AT START OF CLEANUP");
  console.log(userData);
  
  // Make sure we have toys and vocab data before proceeding
  if (!userData.toys || userData.toys.length === 0 || !userData.toys[0].vocab) {
    console.error("No toy or vocab data available for cleanup");
    setCleaning(false);
    return Promise.resolve(null);
  }
  
  return fetch('/api/gemini/get-toy-audio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vocab: JSON.stringify(userData.toys[0].vocab || []),
      filePath: "tmp/file_list.txt"
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const result = JSON.parse(data.toyAudio);
        console.log("RECEIVED AT CLEANUP ", result);
        let newToy: ToyData = userData.toys[0];
        newToy = {
          ...newToy,
          vocab: result
        }
        console.log("NEW TOY IS ", newToy);
        let finalUserData = {...userData, toys: [newToy]};
        saveUserDataToLocalStorage(finalUserData);
        console.log("USER DATA ON LOCALSTORAGE ");
        console.log(localStorage.getItem("userData"));
        fetch('/api/soundboard-prep', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userData: finalUserData
          }),
        });
        console.log("bmp saved");
        setCleaning(false);
        // redirect('/toys');
        return result;
      }
      setCleaning(false);
      return null;
    })
    .catch(error => {
      console.log("ERROR AT COMPLETEREADY ", error);
      setCleaning(false);
      throw error; // Re-throw the error so it can be caught by the caller
    });   
}