import { ToyData, UserData } from '@/types/types';
import { 
  saveToyDataToFile, 
  saveUserDataToFile, 
  saveToysDataToFile,
  saveToyDataToLocalStorage,
  saveUserDataToLocalStorage
} from './saveData';

/**
 * Example of how to use the saveData functions
 */
const exampleUsage = async () => {
  // Example ToyData
  const exampleToy: ToyData = {
    name: 'Growly',
    title: 'Tiger',
    vocab: [
      {
        word: 'tiger',
        translation: 'tigre',
        pronounceUrl: '/audio/tiger.mp3',
        translatePronounceUrl: '/audio/tigre.mp3',
        audioFile: 'tiger.mp3'
      },
      {
        word: 'roar',
        translation: 'rugido',
        pronounceUrl: '/audio/roar.mp3',
        translatePronounceUrl: '/audio/rugido.mp3',
        audioFile: 'roar.mp3'
      }
    ],
    key: 'tiger-123',
    image: '/images/tiger.jpg',
    personalityTraits: ['brave', 'loyal', 'friendly']
  };

  // Example UserData
  const exampleUserData: UserData = {
    language: 'ES',
    readingLevel: 2,
    toys: [exampleToy]
  };

  // Example of multiple toys
  const exampleToys: ToyData[] = [
    exampleToy,
    {
      name: 'Shelly',
      title: 'Turtle',
      vocab: [
        {
          word: 'turtle',
          translation: 'tortuga',
          pronounceUrl: '/audio/turtle.mp3',
          translatePronounceUrl: '/audio/tortuga.mp3',
          audioFile: 'turtle.mp3'
        }
      ],
      key: 'turtle-456',
      image: '/images/turtle.jpg',
      personalityTraits: ['wise', 'gentle', 'calm']
    }
  ];

  try {
    // EXAMPLE 1: Save a single toy - will add to existing toys or update if key exists
    console.log("Example 1: Saving a single toy (will append to existing data)");
    await saveToyDataToFile(exampleToy);
    
    // EXAMPLE 2: Save user data (this will overwrite existing user data)
    console.log("Example 2: Saving user data (will overwrite existing data)");
    await saveUserDataToFile(exampleUserData);
    
    // EXAMPLE 3: Save multiple toys at once - will merge with existing toys
    console.log("Example 3: Saving multiple toys (will merge with existing data)");
    await saveToysDataToFile(exampleToys);
    
    // EXAMPLE 4: Save multiple toys and overwrite existing data
    console.log("Example 4: Saving multiple toys (will overwrite existing data)");
    await saveToysDataToFile(exampleToys, false);
    
    // EXAMPLE 5: Add a new toy with a different key
    const newToy: ToyData = {
      name: 'Hoppy',
      title: 'Rabbit',
      vocab: [
        {
          word: 'rabbit',
          translation: 'conejo',
          pronounceUrl: '/audio/rabbit.mp3',
          translatePronounceUrl: '/audio/conejo.mp3',
          audioFile: 'rabbit.mp3'
        }
      ],
      key: 'rabbit-789',
      image: '/images/rabbit.jpg',
      personalityTraits: ['quick', 'curious', 'gentle']
    };
    
    console.log("Example 5: Adding a new toy to existing collection");
    await saveToyDataToFile(newToy);
    
    // EXAMPLE 6: Update an existing toy
    const updatedToy = {
      ...exampleToy,
      personalityTraits: ['brave', 'loyal', 'friendly', 'fierce']
    };
    
    console.log("Example 6: Updating an existing toy");
    await saveToyDataToFile(updatedToy);
    
    // Client-side examples (these would be used in browser context)
    // saveToyDataToLocalStorage(exampleToy);
    // saveUserDataToLocalStorage(exampleUserData);
    
    console.log('All data saved successfully!');
  } catch (error) {
    console.error('Error in example usage:', error);
  }
};

// Uncomment to run the example
// exampleUsage();

export default exampleUsage; 