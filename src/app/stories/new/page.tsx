'use client';

import { useState, useEffect } from 'react';
import { ToyData, UserData } from '@/types/types';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function NewStoryPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedToys, setSelectedToys] = useState<ToyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedToys, setAnimatedToys] = useState<string[]>([]);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const getUserDataFromLocalStorage = () => {
      if (typeof window === 'undefined') {
        return null;
      }

      try {
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          console.log('No user data found in localStorage');
          return null;
        }

        const parsedData = JSON.parse(userDataString) as UserData;
        return parsedData;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    };

    // Get selected toys from localStorage or URL params
    const getSelectedToysFromStorage = () => {
      if (typeof window === 'undefined') {
        return [];
      }

      try {
        const selectedToysString = localStorage.getItem('selectedToys');
        if (!selectedToysString) {
          return [];
        }

        return JSON.parse(selectedToysString) as string[];
      } catch (error) {
        console.error('Error reading selected toys from localStorage:', error);
        return [];
      }
    };

    const userDataFromStorage = getUserDataFromLocalStorage();
    const selectedToyKeys = getSelectedToysFromStorage();
    
    setUserData(userDataFromStorage);
    
    // Filter toys based on selected keys
    if (userDataFromStorage && userDataFromStorage.toys) {
      const toys = userDataFromStorage.toys.filter(toy => 
        selectedToyKeys.includes(toy.key)
      );
      setSelectedToys(toys);
    }
    
    setIsLoading(false);
  }, []);

  // Animate toys with delay
  useEffect(() => {
    if (selectedToys.length === 0) return;

    // Animate each toy with a delay
    selectedToys.forEach((toy, index) => {
      setTimeout(() => {
        setAnimatedToys(prev => [...prev, toy.key]);
      }, index * 300); // 300ms delay between each toy
    });
  }, [selectedToys]);

  // Generate story when toys are loaded
  useEffect(() => {
    const generateStory = async () => {
      if (selectedToys.length === 0 || isGeneratingStory) return;
      
      setIsGeneratingStory(true);
      
      try {
        // Create prompt with toy names and titles
        const toyDescriptions = selectedToys.map(toy => 
          `${toy.name || 'Unnamed'} the ${toy.title || 'Character'}`
        ).join(', ');
        
        const prompt = `Create a story featuring these characters: ${toyDescriptions}`;
        
        // Call the API route instead of the server function directly
        const response = await fetch('/api/gemini/create-story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Parse the JSON result
        const storyData = JSON.parse(data.result);
        
        // Add timestamp and ID to the story
        const storyWithMetadata = {
          ...storyData,
          id: `story_${Date.now()}`,
          createdAt: new Date().toISOString(),
          characters: selectedToys.map(toy => ({
            key: toy.key,
            name: toy.name,
            title: toy.title,
            image: toy.image
          }))
        };
        
        // Get existing stories from localStorage or initialize empty array
        const existingStoriesString = localStorage.getItem('stories');
        const existingStories = existingStoriesString 
          ? JSON.parse(existingStoriesString) 
          : [];
        
        // Add new story to the array
        const updatedStories = [storyWithMetadata, ...existingStories];
        
        // Save updated stories array to localStorage
        localStorage.setItem('stories', JSON.stringify(updatedStories));
        
        // Set the current story ID in localStorage
        localStorage.setItem('currentStoryId', storyWithMetadata.id);
        
        // Navigate to the story-mode page
        router.push('/stories/story-mode');
      } catch (error) {
        console.error('Error generating story:', error);
        setError('Failed to generate story. Please try again.');
        setIsGeneratingStory(false);
      }
    };
    
    generateStory();
  }, [selectedToys, router, isGeneratingStory]);

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center py-8">
        <div className="text-center">
          <p className="text-xl">Loading your story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center py-8">
        <div className="text-center">
          <p className="text-xl text-red-500">{error}</p>
          <button 
            onClick={() => router.push('/toys')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full pb-24 bg-orange-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bricolage font-semibold text-zinc-500 text-center mb-8 motion-focus motion-duration-[500ms] animate-pulse">
          Creating your story...
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {selectedToys.map((toy) => (
            <ToyCard 
              key={toy.key} 
              toy={toy}
              isAnimated={animatedToys.includes(toy.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const ToyCard = ({ 
  toy,
  isAnimated = false
}: { 
  toy: ToyData;
  isAnimated: boolean;
}) => {
  return (
    <Card 
      className={cn(
        "flex flex-col items-center gap-3 rounded-xs p-8 transition-all duration-500 rotate-2",
        isAnimated ? "motion-focus motion-duration-[500ms]" : "opacity-0"
      )}
    >
      {toy.image ? (
        <Image
          src={toy.image}
          alt={`${toy.name} the ${toy.title}`}
          width={160}
          height={160}
          className="size-40 rounded-md object-cover"
        />
      ) : (
        <div className="h-40 w-40 rounded-md border border-gray-300 bg-gray-100"></div>
      )}
      <div className="flex flex-col items-center gap-0">
        <div className="mx-4 h-auto border-none text-center font-bold shadow-none text-zinc-900 placeholder:text-gray-400 md:text-2xl">
          {toy.name}
        </div>
        <p className="mt-[-2] text-gray-400">{toy.name && 'the'}</p>
        <div className="h-auto border-none text-center font-medium shadow-none text-zinc-500 placeholder:text-gray-400 md:text-xl">
          {toy.title}
        </div>
      </div>
    </Card>
  );
};
