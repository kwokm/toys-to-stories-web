'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToyData, UserData } from '@/types/types';
import { useState, useEffect } from 'react';
import { buildToyCards } from '@/components/toys/toy-cards';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { ScrollText, Library, Settings, Icon } from 'lucide-react';
import { chest } from '@lucide/lab';
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
    router.push('/settings');
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
      <div className="container mx-auto flex min-h-[50vh] motion-opacity-out-0 items-center justify-center py-8 motion-ease-out motion-duration-1000">
        <div className="text-center">
          <p className="text-xl">Loading your toys...</p>
        </div>
      </div>
    );
  }

  // If there are no toys, show a message (the redirect should happen in useEffect)
  if (!userData || !userData.toys || userData.toys.length === 0) {
    return (
      <div className="container mx-16 flex h-auto min-h-screen items-center justify-center bg-orange-50 py-8">
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
          <Button onClick={() => router.push('/stories')} variant="outline">
            <Library className="mr-1 size-4" />
            Library
          </Button>
        )}
        <Button
          disabled={selectedToys.length === 0}
          onClick={handleCreateStory}
          className={`${selectedToys.length > 0 ? 'motion-scale-loop-[102%] grayscale-0 motion-duration-[1500ms]' : ''}grayscale-100 mesh-gradient my-auto ml-auto overflow-clip text-black transition-all duration-[1500ms]`}
        >
          <ScrollText className="mr-1 size-4" />
          Create a Story
        </Button>
        <Button onClick={handleSettings} variant="ghost" size="icon" className="" title="Settings">
          <Settings className="size-4 text-gray-900 hover:border" />
        </Button>
      </div>
      <p
        className={`${selectedToys.length === 0 ? 'opacity-100' : 'opacity-0'} ${hasStories ? 'hidden' : 'flex'} my-auto ml-4 text-[13px] transition-opacity duration-300`}
      >
        Tap some toys to get started!
      </p>
    </>
  );

  return (
    <div className="h-full min-h-screen bg-orange-50 pb-24">
      {/* Header using the PageHeader component */}
      <PageHeader
        icon={<Icon iconNode={chest} className="h-16 w-16" />}
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
