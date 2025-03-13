'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToyData, UserData } from '@/types/types';
import { useState, useEffect } from 'react';
import { buildToyCards } from '@/components/toys/toy-cards';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { ScrollText, Library, Settings } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export default function ToysPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedToys, setSelectedToys] = useState<string[]>([]);
  const [hasStories, setHasStories] = useState(false);

  // Function to handle toy selection
  const handleToySelection = (toyKey: string) => {
    setSelectedToys(prev => {
      // If toy is already selected, remove it from selection
      if (prev.includes(toyKey)) {
        return prev.filter(key => key !== toyKey);
      }
      // Otherwise add it to selection
      return [...prev, toyKey];
    });
  };

  // Function to handle creating a story
  const handleCreateStory = () => {
    // Save selected toys to localStorage
    localStorage.setItem('selectedToys', JSON.stringify(selectedToys));
    
    // Navigate to the stories/new page
    router.push('/stories/new');
  };

  // Function to handle settings navigation
  const handleSettings = () => {
    router.push('/new-user');
  };

  useEffect(() => {
    // Function to safely get data from localStorage
    // This needs to be inside useEffect because localStorage is only available in the browser
    const getUserDataFromLocalStorage = () => {
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
    };

    // Check if user has any stories
    const checkForStories = () => {
      if (typeof window === 'undefined') {
        return false;
      }

      try {
        const storiesString = localStorage.getItem('stories');
        if (!storiesString) {
          return false;
        }
        
        const stories = JSON.parse(storiesString);
        return Array.isArray(stories) && stories.length > 0;
      } catch (error) {
        console.error('Error checking for stories:', error);
        return false;
      }
    };

    // Get the data from localStorage
    const userDataFromStorage = getUserDataFromLocalStorage();
    setUserData(userDataFromStorage);
    setHasStories(checkForStories());
    setIsLoading(false);
  }, []);

  // Handle redirect in a separate useEffect to avoid React state update warnings
  /*
  useEffect(() => {
    if (!isLoading && (!userData || userData.toys.length === 0)) {
      router.push('/');
    }
  }, [isLoading, userData, router]); */

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="motion-opacity-out-0 motion-duration-1000 motion-ease-out container mx-auto flex min-h-[50vh] items-center justify-center py-8">
        <div className="text-center">
          <p className="text-xl">Loading your toys...</p>
        </div>
      </div>
    );
  }

  // If there are no toys, show a message (the redirect should happen in useEffect)
  if (!userData || !userData.toys || userData.toys.length === 0) {
    return (
      <div className="container mx-16 flex min-h-screen h-auto items-center justify-center bg-orange-50 py-8">
        <div className="text-center">
          <p className="mb-4 text-xl">No characters found</p>
        </div>
      </div>
    );
  }
  
  // Prepare the header actions
  const headerActions = (
    <>
      <div className={`flex flex-row gap-2`}>
        {hasStories && (
          <Button 
            onClick={() => router.push('/stories')}
            variant="outline"
          >
            <Library className="size-4 mr-1" />Library
          </Button>
        )}
        <Button 
          disabled={selectedToys.length === 0} 
          onClick={handleCreateStory}
          className={`${selectedToys.length > 0 ? 'grayscale-0 motion-scale-loop-[102%] motion-duration-[1500ms]' : ''}grayscale-100 transition-all duration-[1500ms] my-auto mesh-gradient overflow-clip text-black ml-auto`}
        >
          <ScrollText className="size-4 mr-1" />Create a Story
        </Button>
        {hasStories && (
          <Button 
            onClick={handleSettings}
            variant="ghost"
            size="icon"
            className=""
            title="Settings"
          >
            <Settings className="size-4 text-gray-900 hover:border" />
          </Button>
        )}
      </div>
      <p className={`${selectedToys.length === 0 ? 'opacity-100' : 'opacity-0'} ${hasStories ? 'hidden' : 'flex'} transition-opacity duration-300 my-auto text-[13px] ml-4`}>Tap some toys to get started!</p>
    </>
  );
  
  return (
    <div className="min-h-screen h-full pb-24 bg-orange-50">
      {/* Header using the PageHeader component */}
      <PageHeader
        icon="/assets/treasurechest.svg"
        title="Your Toybox"
        description="Each toy you add here syncs directly to the soundboard!"
        actions={headerActions}
      />

      {/* Start Lower Area */}
      <div className="px-12 pt-12">
        {buildToyCards(userData?.toys || [], selectedToys, handleToySelection)}
      </div>
      {/* End Toy Cards */}

      {/* Language Toggle 
      <div className="fixed bottom-8 right-8">
          <div className="p-4 bg-white rounded-full shadow-md flex gap-2 flex-row">
            <Switch className="my-auto"></Switch>
            <p className="text-sm font-medium">
            Language Learning Mode</p>
          </div>
      </div> */}
      
    </div>
  );
}
