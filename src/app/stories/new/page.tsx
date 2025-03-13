'use client';

import { useState, useEffect, useRef } from 'react';
import { ToyData, UserData } from '@/types/types';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NewStoryPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedToys, setSelectedToys] = useState<ToyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedToys, setAnimatedToys] = useState<string[]>([]);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [cloudSaveSuccess, setCloudSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Set up event listener for beforeunload to handle back navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isGeneratingStory) {
        // Cancel the story generation
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Show a confirmation dialog
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    // Set up popstate event to handle back button
    const handlePopState = () => {
      if (isGeneratingStory) {
        // Cancel the story generation
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Show toast notification
        toast.info("Story creation cancelled");
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isGeneratingStory]);

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

    // Ensure user has a unique ID
    const ensureUserId = () => {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        // Generate a unique ID if one doesn't exist
        userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('userId', userId);
      }
      return userId;
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

    // Ensure user has a unique ID
    ensureUserId();

    setUserData(userDataFromStorage);

    // Filter toys based on selected keys
    if (userDataFromStorage && userDataFromStorage.toys) {
      const toys = userDataFromStorage.toys.filter(toy => selectedToyKeys.includes(toy.key));
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
        // Create a new AbortController for this request
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        // Create prompt with toy names and titles
        const toyDescriptions = selectedToys
          .map(toy => `${toy.name || 'Unnamed'} the ${toy.title || 'Character'}`)
          .join(', ');

        const prompt = `Create a story featuring these characters: ${toyDescriptions}`;

        // Call the API route instead of the server function directly
        const response = await fetch('/api/gemini/create-story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
          signal, // Pass the abort signal
        });

        // Check if the request was aborted
        if (signal.aborted) {
          console.log('Story generation was cancelled');
          setIsGeneratingStory(false);
          return;
        }

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
            image: toy.image,
          })),
        };

        // Get existing stories from localStorage or initialize empty array
        const existingStoriesString = localStorage.getItem('stories');
        const existingStories = existingStoriesString ? JSON.parse(existingStoriesString) : [];

        // Add new story to the array
        const updatedStories = [storyWithMetadata, ...existingStories];

        // Save updated stories array to localStorage
        localStorage.setItem('stories', JSON.stringify(updatedStories));

        // Set the current story ID in localStorage
        localStorage.setItem('currentStoryId', storyWithMetadata.id);

        // Save stories to Vercel Blob
        try {
          setIsSavingToCloud(true);

          // Get or create user ID
          const userId =
            localStorage.getItem('userId') ||
            `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

          // Create a promise that rejects after a timeout
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Cloud save operation timed out')), 5000);
          });

          // Race the fetch operation against the timeout
          const blobResponse = (await Promise.race([
            fetch('/api/stories/save', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                stories: updatedStories,
                userId: userId,
              }),
              signal, // Pass the abort signal
            }),
            timeoutPromise,
          ])) as Response;

          // Check if the request was aborted
          if (signal.aborted) {
            console.log('Cloud save was cancelled');
            setIsSavingToCloud(false);
            return;
          }

          if (blobResponse.ok) {
            const blobData = await blobResponse.json();
            console.log('Stories saved to cloud storage:', blobData.url);

            // Optionally store the cloud URL in localStorage
            localStorage.setItem('storiesCloudUrl', blobData.url);
            setCloudSaveSuccess(true);

            // Clear success message after 3 seconds
            setTimeout(() => {
              setCloudSaveSuccess(false);
            }, 3000);
          } else {
            // If blob storage fails, we still have the stories in localStorage
            console.error('Failed to save stories to cloud storage');
          }
          setIsSavingToCloud(false);
        } catch (error) {
          // If there's an error saving to cloud, log it but continue
          console.error('Error saving stories to cloud storage:', error);
          setIsSavingToCloud(false);
        }

        // Navigate to the story-mode page
        router.push('/stories/story-mode');
      } catch (error: any) {
        // Check if the error is due to the request being aborted
        if (error.name === 'AbortError') {
          console.log('Story generation was cancelled');
          setIsGeneratingStory(false);
          return;
        }
        
        console.error('Error generating story:', error);
        setError('Failed to generate story. Please try again.');
        setIsGeneratingStory(false);
      }
    };

    generateStory();
  }, [selectedToys, router, isGeneratingStory]);

  // Add a cancel button
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setIsGeneratingStory(false);
    router.push('/toys');
    toast.info("Story creation cancelled");
  };

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
            className="mt-4 rounded-md bg-orange-500 px-4 py-2 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen bg-orange-50 pb-24">
      <div className="container mx-auto px-4 py-12">
        <h1 className="motion-focus mb-8 animate-pulse text-center font-bricolage text-3xl font-semibold text-zinc-500 motion-duration-[500ms]">
          Creating your story...
        </h1>

        {/* Cancel button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={handleCancel}
            className="rounded-md border border-orange-300 bg-white px-4 py-2 text-orange-500 transition-colors hover:bg-orange-50"
          >
            Cancel
          </button>
        </div>

        {isSavingToCloud && (
          <div className="mb-4 flex justify-center">
            <p className="motion-focus inline-flex animate-pulse items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm text-zinc-500 motion-duration-[300ms]">
              <span className="size-2 rounded-full bg-orange-400"></span>
              Saving to cloud...
            </p>
          </div>
        )}

        {cloudSaveSuccess && (
          <div className="mb-4 flex justify-center">
            <p className="motion-focus inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm text-green-600 motion-duration-[300ms]">
              <span className="size-2 rounded-full bg-green-500"></span>
              Story saved to cloud!
            </p>
          </div>
        )}

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {selectedToys.map(toy => (
            <ToyCard key={toy.key} toy={toy} isAnimated={animatedToys.includes(toy.key)} />
          ))}
        </div>
      </div>
    </div>
  );
}

const ToyCard = ({ toy, isAnimated = false }: { toy: ToyData; isAnimated: boolean }) => {
  return (
    <Card
      className={cn(
        'flex rotate-2 flex-col items-center gap-3 rounded-xs p-8 transition-all duration-500',
        isAnimated ? 'motion-focus motion-duration-[500ms]' : 'opacity-0'
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
        <div className="mx-4 h-auto border-none text-center font-bold text-zinc-900 shadow-none placeholder:text-gray-400 md:text-2xl">
          {toy.name}
        </div>
        <p className="mt-[-2] text-gray-400">{toy.name && 'the'}</p>
        <div className="h-auto border-none text-center font-medium text-zinc-500 shadow-none placeholder:text-gray-400 md:text-xl">
          {toy.title}
        </div>
      </div>
    </Card>
  );
};
